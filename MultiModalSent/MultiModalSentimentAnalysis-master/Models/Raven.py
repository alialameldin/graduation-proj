import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input, Concatenate, BatchNormalization
from tensorflow.keras.models import Model

class Shifted_word(tf.keras.layers.Layer):
  def __init__(self, beta):
    super(Shifted_word, self).__init__()
    
    self.beta = tf.constant(beta)
    
  def call(self, h, e):
      
      alpha = tf.math.minimum(tf.multiply(tf.divide(tf.norm(e), tf.norm(h)), self.beta), tf.constant(1,dtype=tf.float32))
      e_m = tf.add(e, tf.multiply(alpha, h))

      return e_m
  def get_config(self):
      config = {
        'beta': self.beta
        }      
      base_config = super(Shifted_word, self).get_config()
      return dict(list(base_config.items()) + list(config.items()))
    
  @classmethod
  def from_config(cls, config):
        return cls(**config)

def Raven(visual_data, acoustic_data, language_data):
    '''
    
    Raven(visual_data, acoustic_data, language_data)
    
    Parameters
    ----------
    visual_data: numpy array.
        Numpy array of the visual data.    
    acoustic_data: numpy array.
        Numpy array of the acoustic data.
    language_data: numpy array.
        Numpy array of the language/text data.    
        
    Returns
    -------
    model
        Tensorflow model.

    '''
    in_v = Input(shape= visual_data.shape[1:])
    in_a = Input(shape= acoustic_data.shape[1:])
    in_l = Input(shape= language_data.shape[1:])
    
    h_v = Dense(150, activation='linear', name= 'dense_v')(in_v)
    h_a = Dense(150, activation='linear', name= 'dense_a')(in_a)
    
    concat_l_v = Concatenate(axis=-1)([h_v, in_l])
    concat_l_a = Concatenate(axis=-1)([h_a, in_l])
    
    gate_v = Dense(1, activation='sigmoid')(concat_l_v)
    gate_a = Dense(1, activation='sigmoid')(concat_l_a)
    
    gated_h_v = gate_v * h_v
    gated_h_a = gate_a * h_a
    
    h = Dense(300, activation = 'relu')(Concatenate(axis=-1)([gated_h_v, gated_h_a]))
    
    h = BatchNormalization()(h)
    
    e_m = Shifted_word(0.2)(h, in_l)
    
    e_m = BatchNormalization()(e_m)
    
    e_m = Dropout(0.2)(e_m)
    
    x = LSTM(300)(e_m)
    
    out = Dense(1, activation= 'sigmoid')(x)
    
    return Model(inputs= [in_v, in_a, in_l], outputs= out)





