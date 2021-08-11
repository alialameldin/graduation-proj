import tensorflow as tf
from tensorflow.keras.layers import Conv1D, Dense, Concatenate, Input, Flatten, Masking
from tensorflow.keras.models import Model
from .utils.Encoder import Encoder
from .utils.CustomScheduler import CustomScheduler
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import BinaryCrossentropy, SparseCategoricalCrossentropy
import numpy as np

def MulT(visual_data, acoustic_data, language_data):
    """
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

    """
    
    d_model = 40
    
    in_l = tf.keras.Input(shape= language_data.shape[1:])
    in_v = tf.keras.Input(shape= visual_data.shape[1:])
    in_a = tf.keras.Input(shape= acoustic_data.shape[1:])
    
    # in_l = Input(shape= language_data.shape[1:], name= 'input_language')
    # in_v = Input(shape= visual_data.shape[1:], name= 'input_visual')
    # in_a = Input(shape= acoustic_data.shape[1:], name= 'input_acoustic')
    
    in_l_m = Masking(mask_value= 0)(in_l)
    in_v_m = Masking(mask_value= 0)(in_v)
    in_a_m = Masking(mask_value= 0)(in_a)
    
    i_l = Conv1D(d_model, 3)(in_l_m)
    i_v = Conv1D(d_model, 3)(in_v_m)
    i_a = Conv1D(d_model, 3)(in_a_m)
    
    max_pos_enc_l = language_data.shape[1]
    max_pos_enc_v = visual_data.shape[1]
    max_pos_enc_a = acoustic_data.shape[1]
    
    enc_a_to_l = Encoder(4, d_model, 10, d_model, max_pos_enc_l, rate=0.2)(i_l, i_a, i_a, True)
    enc_v_to_l = Encoder(4, d_model, 10, d_model, max_pos_enc_l, rate=0.2)(i_l, i_v, i_v, True)
    
    enc_a_to_v = Encoder(4, d_model, 10, d_model, max_pos_enc_v, rate=0.2)(i_v, i_a, i_a, True)
    enc_l_to_v = Encoder(4, d_model, 10, d_model, max_pos_enc_v, rate=0.2)(i_v, i_l, i_l, True)
    
    enc_v_to_a = Encoder(4, d_model, 10, d_model, max_pos_enc_a, rate=0.2)(i_a, i_v, i_v, True)
    enc_l_to_a = Encoder(4, d_model, 10, d_model, max_pos_enc_a, rate=0.2)(i_a, i_l, i_l, True)
    
    conc_l = Concatenate(axis= 2)([enc_a_to_l, enc_v_to_l])
    conc_v = Concatenate(axis= 2)([enc_a_to_v, enc_l_to_v])
    conc_a = Concatenate(axis= 2)([enc_v_to_a, enc_l_to_a])
    
    trans_l = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_l, rate=0.2)(conc_l, conc_l, conc_l, True)
    trans_v = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_v, rate=0.2)(conc_v, conc_v, conc_v, True)
    trans_a = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_a, rate=0.2)(conc_a, conc_a, conc_a, True)

    out_conc = Concatenate(axis= 1)([trans_l, trans_v, trans_a])
    
    flatten = Flatten()(out_conc)
    
    out_1 = Dense(1, activation= 'sigmoid')(flatten)
    
    return Model(inputs= [in_v, in_a, in_l], outputs= out_1)
    
#     learning_rate = CustomScheduler(d_model)
#     optimizer = Adam(learning_rate, beta_1=0.9, beta_2=0.98,
#                                      epsilon=1e-9)
#     bce = tf.keras.losses.BinaryCrossentropy(
#         from_logits=True, reduction='none')
    
#     labelsArr = []
#     predsArr = []
    
#     def accuracy_function(real, pred):
#         return int(real == np.round(pred))
  
#     train_loss = tf.keras.metrics.Mean(name='train_loss')
#     train_accuracy = tf.keras.metrics.Mean(name='train_accuracy')
    
#     def train_step(inp_v, inp_a, inp_t, y):    
#       with tf.GradientTape() as tape:
#         predictions = model([inp_v, inp_a, inp_t])
#         predsArr.append(predictions.numpy()[0][0])
#         labelsArr.append(y)
#         loss = bce(labelsArr, predsArr)
    
#       # gradients = tape.gradient(loss, model.trainable_variables)
#       def _compute_gradients(tensor, var_list):
#           grads = tape.gradient(tensor, var_list)
#           return [grad if grad is not None else tf.zeros_like(var)
#                   for var, grad in zip(var_list, grads)]
#       gradients = _compute_gradients(loss, model.trainable_variables)
#       optimizer.apply_gradients((grad, var) 
#             for (grad, var) in zip(gradients, model.trainable_variables) 
#             if grad is not None)
    
#       train_loss(loss)
#       train_accuracy(accuracy_function(y, predictions.numpy()[0][0]))
      
#     for epoch in range(50):
#         train_loss.reset_states()
#         train_accuracy.reset_states()
      
#         # inp -> portuguese, tar -> english
#         for index, (v, a, t, y) in enumerate(zip(visual_data, acoustic_data, language_data, labels)):
#             v = v.reshape(1, *v.shape)
#             a = a.reshape(1, *a.shape)
#             t = t.reshape(1, *t.shape)
#             train_step(v, a, t, y)
#             if index % 50 == 0:
#                 print('Epoch: ', epoch, 'index: ', index, 'train_loss: ',
#                       train_loss.result().numpy(), 'train_accuracy', train_accuracy.result().numpy())
  
# def create_padding_mask(seq):
#   seq = tf.cast(tf.math.equal(seq, 0), tf.float32)

#   # add extra dimensions to add the padding
#   # to the attention logits.
#   return seq[:, tf.newaxis, tf.newaxis, :]  # (batch_size, 1, 1, seq_len)  