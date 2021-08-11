import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input,Embedding, Concatenate,\
    BatchNormalization, Add, GlobalAveragePooling1D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import TimeDistributed
from tensorflow.keras.models import Model
import os
import pickle
import requests
from .DataProcessing import extract_features, load_embedding_matrix, load_labels, extract_features_using_config
from .TextFeatureExtractor import extract_textual_features, extract_textual_features_using_tokenizer
import numpy as np
from time import time

class RavenModel :
    def __init__(self, data_path, conf_files_path, model_id):
        self.data_path = data_path
        self.is_trained_flag = False
        self.model = None
        self.history = None
        self.config = None
        self.conf_files_path = conf_files_path
        self.model_id = model_id
        
    def train(self):
        start = time()
        x, self.config   = extract_features(self.data_path, self.model_id, self.conf_files_path)

        labels = load_labels(self.data_path)

        tokenizer = self.config['tokenizer']
        textual_data = x[0]
        acoustic_data = x[1]
        visual_data = x[2]

        embedding_matrix = load_embedding_matrix(tokenizer, path= self.conf_files_path)
        print('Raven Feature Extraction time: ', time())
        start = time()        
        self.model = self.__model__(textual_data.shape, acoustic_data.shape, visual_data.shape, embedding_matrix)

        self.model.compile(loss= 'binary_crossentropy', optimizer= Adam(1e-3), metrics= ['accuracy'])

        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor= 'val_loss',\
                                  factor= 0.1, patience= 7, min_lr= 1e-5)
            
        early_stopping = tf.keras.callbacks.EarlyStopping(monitor= 'val_accuracy',\
                                  patience= 8, restore_best_weights= True)
        
        print(labels.shape)
        textual_data, acoustic_data, visual_data, labels = self.shuffle(textual_data, acoustic_data, visual_data, labels)
            
        X_t_train, X_t_valid = self.split(textual_data) 
        X_a_train, X_a_valid = self.split(acoustic_data)  
        X_v_train, X_v_valid = self.split(visual_data)
        Y_train, Y_valid = self.split(labels)
        
        self.history = self.model.fit([X_t_train, X_a_train, X_v_train],
            Y_train.reshape(Y_train.shape[0], -1),batch_size= 32,\
            validation_data= ([X_t_valid, X_a_valid, X_v_valid], Y_valid.reshape(Y_valid.shape[0], -1)),
            epochs= 40,shuffle=True,\
            callbacks=[reduce_lr, early_stopping])
        print('Raven training time: ', time())
    def __model__ (self, textual_data, acoustic_data, visual_data, embedding_matrix):
        num_heads = 1
        ff_dim = 300  
        
        in_a_a=  Input(shape= acoustic_data[1:])
        
        in_a = tf.keras.layers.Masking()(in_a_a)
        in_a = Dense(150, activation='relu')(in_a)
        in_a = BatchNormalization(-1,epsilon=1e-6)(in_a)
        in_a = Dropout(0.4)(in_a)
        h_a = TimeDistributed(LSTM(150))(in_a)
        
        in_v_v=  Input(shape= visual_data[1:])
        
        in_v = tf.keras.layers.Masking()(in_v_v)
        in_v = Dense(150, activation='relu')(in_v)
        in_v = BatchNormalization(-1,epsilon=1e-6)(in_v)
        in_v = Dropout(0.4)(in_v)
        h_v = TimeDistributed(LSTM(150))(in_v)
        
        in_l = Input(textual_data[1:])
        
        in_l_l=Embedding(input_dim= 13200, output_dim= 300, mask_zero= True, 
         embeddings_initializer=tf.keras.initializers.Constant(embedding_matrix),
             trainable=False)(in_l)
        
        in_l_l = BatchNormalization(-1,epsilon=1e-6)(in_l_l)
        
        concat_l_v = Concatenate(axis=-1)([h_v, in_l_l])
        concat_l_a = Concatenate(axis=-1)([h_a, in_l_l])
        
        gate_v = Dense(1, activation='sigmoid')(concat_l_v)
        gate_a = Dense(1, activation='sigmoid')(concat_l_a)
        
        gated_h_v = gate_v * h_v
        gated_h_a = gate_a * h_a
        
        dense = Dense(300, activation = 'linear')
        h = dense(Concatenate(axis=-1)([gated_h_a,gated_h_v]))
        h = BatchNormalization(-1,epsilon=1e-6)(h)
        
        
        alpha = tf.math.minimum(tf.multiply(tf.divide(tf.norm(in_l_l, axis=-1,\
             keepdims=True), tf.norm(h, axis=-1, keepdims=True)),\
            tf.constant(0.2)), tf.constant(1,dtype=tf.float32))
            
        e_m = Add()([in_l_l , h * alpha])
        
        embedding_layer = TokenAndPositionEmbedding(textual_data[1], 20000, 300)
        e_m = embedding_layer(e_m)
        x = TransformerBlock(300 , num_heads, ff_dim)(e_m)
        
        x = GlobalAveragePooling1D()(x)
        x = Dense(20, activation="relu")(x)
        out = Dense(1, activation= 'sigmoid')(x)
        model = Model(inputs= [in_l,in_a_a,in_v_v], outputs= out)
        
        return model
        
        
    def save_model(self, save_path):
        self.model.save_weights(save_path)
        with open(os.path.abspath(os.path.join(save_path, os.pardir, 'raven_config_dict.pkl')), 'wb') as config_dictionary_file:
           pickle.dump(self.config, config_dictionary_file)
    
    def load_model(self, save_path):
        with open(os.path.abspath(os.path.join(save_path, os.pardir, 'raven_config_dict.pkl')), 'rb') as handle:
            self.config = pickle.load(handle)
        
        tokenizer = self.config['tokenizer']
        textual_data = self.config['text_shapes']
        visual_data = self.config['video_shapes']
        acoustic_data = self.config['audio_shapes']
        embedding_matrix = load_embedding_matrix(tokenizer, path= self.conf_files_path)
        self.model = self.__model__(textual_data, acoustic_data, visual_data, embedding_matrix)
        self.model.load_weights(save_path)

    def get_accuracy(self):
        return max(self.history.history['val_accuracy'])
    
    def predict(self, data_path):
        x = extract_features_using_config(self.data_path, self.config, self.model_id, self.conf_files_path)
        textual_data = x[0]
        acoustic_data = x[1]
        visual_data = x[2]
        
        predictions = self.model.predict([textual_data, acoustic_data, visual_data])
        return predictions
    
    def split(self, X):  
        n = len(X)
        X_train = X[0: int(n*0.8)]
        X_valid = X[int(n*0.8):]
        return X_train, X_valid
    
    def shuffle(self, X_t, X_a, X_v, Y):
        shuffler = np.random.permutation(len(X_v))
        X_v = X_v[shuffler]
        X_a = X_a[shuffler]
        X_t = X_t[shuffler]
        Y = Y[shuffler]    
        return X_t, X_a, X_v, Y

class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, embed_dim, num_heads, ff_dim, rate=0.1):
        super(TransformerBlock, self).__init__()
        self.att = tf.keras.layers.MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)
        self.ffn = tf.keras.Sequential(
            [Dense(ff_dim, activation="relu"), Dense(embed_dim),]
        )
        self.layernorm1 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.layernorm2 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.dropout1 = tf.keras.layers.Dropout(rate)
        self.dropout2 = tf.keras.layers.Dropout(rate)

    def call(self, inputs, training):
        attn_output = self.att(inputs, inputs)
        attn_output = self.dropout1(attn_output, training=training)
        out1 = self.layernorm1(inputs + attn_output)
        ffn_output = self.ffn(out1)
        ffn_output = self.dropout2(ffn_output, training=training)
        return self.layernorm2(out1 + ffn_output)
    def get_config(self):
        config= {
            "att": self.att,
                "ffn": self.ffn,
                "layernorm1": self.layernorm1,
                "layernorm2": self.layernorm2,
                "dropout1": self.dropout1,
                "dropout2": self.dropout2,}
        base_config = super().get_config()
        return dict(list(base_config.items()) + list(config.items()))
    
    @classmethod
    def from_config(cls, config):
        return cls(**config)

class TokenAndPositionEmbedding(tf.keras.layers.Layer):
    def __init__(self, maxlen, vocab_size, embed_dim):
        super(TokenAndPositionEmbedding, self).__init__()
        
        self.pos_emb = tf.keras.layers.Embedding(input_dim=maxlen, output_dim=embed_dim)

    def call(self, x):
        maxlen = tf.shape(x)[1]
        positions = tf.range(start=0, limit=maxlen, delta=1)
        positions = self.pos_emb(positions)
        return x + positions
    def get_config(self):
        config =  {"pos_emb": self.pos_emb}
        base_config = super().get_config()
        return dict(list(base_config.items()) + list(config.items()))
    
    @classmethod
    def from_config(cls, config):
        return cls(**config)