import gc
import numpy as np
import pickle
import os
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from tensorflow.keras import backend as K
from tensorflow.keras.layers import Input, Bidirectional, GRU, Masking, Dense, Dropout, TimeDistributed, Lambda, \
    Activation, dot, multiply, concatenate
from tensorflow.keras.models import Model

class MMMUBA:
    def __init__(self, feat_ext_path):
        self.feat_ext_path = feat_ext_path
        super(MMMUBA)
        
    def retreiveData(self):
        INPUT_DIR = os.path.join(self.feat_ext_path, os.pardir, 'input')
        # Retreive Data
        (train_text, train_label, test_text, test_label, max_utt_len, train_len, test_len) = pickle.load(
            open(os.path.join(INPUT_DIR, 'text.pickle'), 'rb'))
        (train_audio, _, test_audio, _, _, _, _) = pickle.load(open(os.path.join(INPUT_DIR, 'audio.pickle'), 'rb'))
        (train_video, _, test_video, _, _, _, _) = pickle.load(open(os.path.join(INPUT_DIR, 'video.pickle'), 'rb'))
    
        train_label, test_label = self.create_one_hot_labels(train_label.astype('int'), test_label.astype('int'))
    
        train_mask, test_mask = self.create_mask(train_text, test_text, train_len, test_len)
    
        print(train_text.shape)
    
        return (train_text, test_text,
                train_audio, test_audio,
                train_video, test_video,
                train_label, test_label,
                train_mask, test_mask,
                train_len, test_len, max_utt_len)
    
    
    def calc_test_result(self, result, test_label, test_mask, print_detailed_results=False):
        """
        # Arguments
            predicted test labels, gold test labels and test mask
    
        # Returns
            accuracy of the predicted labels
        """
        true_label = []
        predicted_label = []
    
        for i in range(result.shape[0]):
            for j in range(result.shape[1]):
                if test_mask[i, j] == 1:
                    true_label.append(np.argmax(test_label[i, j]))
                    predicted_label.append(np.argmax(result[i, j]))
    
        if print_detailed_results:
            print("Confusion Matrix :")
            print(confusion_matrix(true_label, predicted_label))
            print("Classification Report :")
            print(classification_report(true_label, predicted_label))
        print("Accuracy ", accuracy_score(true_label, predicted_label))
        return accuracy_score(true_label, predicted_label)
    
    
    def create_one_hot_labels(self, train_label, test_label):  # by3ml two columns wa7ed lel zeroes we wa7ed lel ones
        """
        # Arguments
            train and test labels (2D matrices)
    
        # Returns
            one hot encoded train and test labels (3D matrices)
        """
    
        maxlen = int(max(train_label.max(), test_label.max()))
    
        train = np.zeros((train_label.shape[0], train_label.shape[1], maxlen + 1))
        test = np.zeros((test_label.shape[0], test_label.shape[1], maxlen + 1))
    
        for i in range(train_label.shape[0]):
            for j in range(train_label.shape[1]):
                train[i, j, train_label[i, j]] = 1
    
        for i in range(test_label.shape[0]):
            for j in range(test_label.shape[1]):
                test[i, j, test_label[i, j]] = 1
    
        return train, test
    
    
    def create_mask(self, train_data, test_data, train_length, test_length):
        """
        # Arguments
            train, test data (any one modality (text, audio or video)), utterance lengths in train, test videos
    
        # Returns
            mask for train and test data
        """
    
        train_mask = np.zeros((train_data.shape[0], train_data.shape[1]), dtype='float')
        for i in range(len(train_length)):
            train_mask[i, :train_length[i]] = 1.0
    
        test_mask = np.zeros((test_data.shape[0], test_data.shape[1]), dtype='float')
        for i in range(len(test_length)):
            test_mask[i, :test_length[i]] = 1.0
    
        return train_mask, test_mask
    
    
    def bi_modal_attention(self, x, y):  # de tare2et el bimodal attention elly bst5dmha fe el MMMU_BA
        #  Mwgood el implementation bta3ha fe el paper
    
        """
        .  stands for dot product
        *  stands for elemwise multiplication
        {} stands for concatenation
    
        m1 = x . transpose(y) ||  m2 = y . transpose(x)
        n1 = softmax(m1)      ||  n2 = softmax(m2)
        o1 = n1 . y           ||  o2 = m2 . x
        a1 = o1 * x           ||  a2 = o2 * y
    
        return {a1, a2}
    
        """
    
        m1 = dot([x, y], axes=[2, 2])
        n1 = Activation('softmax')(m1)
        o1 = dot([n1, y], axes=[2, 1])
        a1 = multiply([o1, x])
    
        m2 = dot([y, x], axes=[2, 2])
        n2 = Activation('softmax')(m2)
        o2 = dot([n2, x], axes=[2, 1])
        a2 = multiply([o2, y])
    
        return concatenate([a1, a2])
    
    
    def self_attention(self, x):  # de tare2et el self attention model elly bst5dmha fe el MMUU_SA we el MU_SA
    
        """
        .  stands for dot product
        *  stands for elemwise multiplication
    
        m = x . transpose(x)
        n = softmax(m)
        o = n . x
        a = o * x
    
        return a
    
        """
    
        m = dot([x, x], axes=[2, 2])
        n = Activation('softmax')(m)
        o = dot([n, x], axes=[2, 1])
        a = multiply([o, x])
    
        return a
    
    
    def contextual_attention_model(self, mode,
                                   data):  # de el function elly b5tar feha el mode elly hsht8l 3aleeh eza kan MMMU_BA aw
        # MMUU_SA aw MU_SA
    
        train_text = data[0]
    
        train_audio = data[2]
    
        train_video = data[4]
    
        max_utt_len = data[12]
    
        # ########## Input Layer ############ Hna b3ml instance mn el keras tensor >>> 3chan a3ml el model fe keras lazem
        # adeelo inputs we elly ana mstneeh mno k output
    
        in_text = Input(shape=(train_text.shape[1], train_text.shape[2]))
        in_audio = Input(shape=(train_audio.shape[1], train_audio.shape[2]))
        in_video = Input(shape=(train_video.shape[1], train_video.shape[2]))
    
        ########### Masking Layer ############
    
        masked_text = Masking(mask_value=0)(
            in_text)  # hna b3ml masking we de bst5dmha lw msln fe 7aga 3ayz afwtha fe el data >>>> hna hfwt ay data
        # qemetha b zero
        masked_audio = Masking(mask_value=0)(in_audio)
        masked_video = Masking(mask_value=0)(in_video)
    
        ########### Recurrent Layer ############   BI-GRU implementation         
    
        drop_rnn = 0.7
        gru_units = 300
    
        rnn_text = Bidirectional(GRU(gru_units, return_sequences=True, dropout=0.5, recurrent_dropout=0.5),
                                 merge_mode='concat')(masked_text)
        rnn_audio = Bidirectional(GRU(gru_units, return_sequences=True, dropout=0.5, recurrent_dropout=0.5),
                                  merge_mode='concat')(masked_audio)
        rnn_video = Bidirectional(GRU(gru_units, return_sequences=True, dropout=0.5, recurrent_dropout=0.5),
                                  merge_mode='concat')(masked_video)
    
        rnn_text = Dropout(drop_rnn)(rnn_text)
        rnn_audio = Dropout(drop_rnn)(rnn_audio)
        rnn_video = Dropout(drop_rnn)(rnn_video)
    
        ########### Time-Distributed Dense Layer ############ Dense Layer
    
        drop_dense = 0.7
        dense_units = 100
    
        dense_text = Dropout(drop_dense)(TimeDistributed(Dense(dense_units, activation='tanh'))(rnn_text))
        dense_audio = Dropout(drop_dense)(TimeDistributed(Dense(dense_units, activation='tanh'))(rnn_audio))
        dense_video = Dropout(drop_dense)(TimeDistributed(Dense(dense_units, activation='tanh'))(rnn_video))
    
        ########### Attention Layer ############
    
        ## Multi Modal Multi Utterance Bi-Modal attention ##
        if mode == 'MMMU_BA':
    
            vt_att = self.bi_modal_attention(dense_video, dense_text)
            av_att = self.bi_modal_attention(dense_audio, dense_video)
            ta_att = self.bi_modal_attention(dense_text, dense_audio)
    
            merged = concatenate([vt_att, av_att, ta_att, dense_video, dense_audio, dense_text])
    
    
        ## Multi Modal Uni Utterance Self Attention ##
        elif mode == 'MMUU_SA':
    
            attention_features = []
    
            for k in range(max_utt_len):
                # extract multi modal features for each utterance #
                m1 = Lambda(lambda x: x[:, k:k + 1, :])(dense_video)
                m2 = Lambda(lambda x: x[:, k:k + 1, :])(dense_audio)
                m3 = Lambda(lambda x: x[:, k:k + 1, :])(dense_text)
    
                utterance_features = concatenate([m1, m2, m3], axis=1)
                attention_features.append(self.self_attention(utterance_features))
    
            merged_attention = concatenate(attention_features, axis=1)
            merged_attention = Lambda(lambda x: K.reshape(x, (-1, max_utt_len, 3 * dense_units)))(merged_attention)
    
            merged = concatenate([merged_attention, dense_video, dense_audio, dense_text])
    
    
        ## Multi Utterance Self Attention ##
        elif mode == 'MU_SA':
    
            vv_att = self.self_attention(dense_video)
            tt_att = self.self_attention(dense_text)
            aa_att = self.self_attention(dense_audio)
    
            merged = concatenate([aa_att, vv_att, tt_att, dense_video, dense_audio, dense_text])
    
    
        ## No Attention ##    
        elif mode == 'None':
    
            merged = concatenate([dense_video, dense_audio, dense_text])
    
        else:
            print("Mode must be one of 'MMMU-BA', 'MMUU-SA', 'MU-SA' or 'None'.")
            return
    
        ########### Output Layer ############
    
        output = TimeDistributed(Dense(2, activation='softmax'))(merged)
        model = Model([in_text, in_audio, in_video], output)
    
        return model
    
    
    def train(self, mode):
    
        data = self.retreiveData()
    
        train_text = data[0]
        test_text = data[1]
    
        train_audio = data[2]
        test_audio = data[3]
    
        train_video = data[4]
        test_video = data[5]
    
        train_label = data[6]
        test_label = data[7]
    
        test_mask = data[9]
    
        print(train_text.shape)
    
        runs = 3
        accuracy = []
        models = []
    
        for j in range(runs):
            np.random.seed(j + 1)
            tf.random.set_seed(j + 1)
    
            # compile model #
            model = self.contextual_attention_model(mode, data)
            model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
            
            reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor= 'val_loss',\
                                  factor= 0.1, patience= 10, min_lr= 1e-5)
            
            early_stopping = tf.keras.callbacks.EarlyStopping(monitor= 'val_accuracy',\
                                  patience= 20, restore_best_weights= True)
    
            # train model #
            history = model.fit([train_text, train_audio, train_video], train_label,
                                epochs=50,
                                batch_size=8,
                                shuffle=True,
                                validation_split=0.2,
                                verbose=1,
                                callbacks=[reduce_lr, early_stopping])
    
            # test results #
            # model.load_weights(path)
            test_predictions = model.predict([test_text, test_audio, test_video])
            test_accuracy = self.calc_test_result(test_predictions, test_label, test_mask)
            accuracy.append(test_accuracy)
            models.append(model)
    
            # release gpu memory #
            K.clear_session()
            del model, history
            gc.collect()
    
        # summarize test results #
    
        avg_accuracy = sum(accuracy) / len(accuracy)
        max_seed = np.argmax(accuracy)
        max_accuracy = accuracy[max_seed]
        max_model = models[max_seed]
    
        print('Mode: ', mode)
        print('Avg Test Accuracy:', '{0:.4f}'.format(avg_accuracy), '|| Max Test Accuracy:', '{0:.4f}'.format(max_accuracy))
        print('-' * 55)
    
        return max_model, max_accuracy
