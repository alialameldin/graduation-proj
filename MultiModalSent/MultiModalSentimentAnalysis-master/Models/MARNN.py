import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Concatenate, Bidirectional, GRU, Flatten, Dropout
from tensorflow.keras.models import Model
from utils.MARNN.ScaledDotProductAttention import ScaledDotProductAttention

def MARNN(X_v, X_a, X_t, multi_class= False):
    """
    Multi-Attention RNN (MARNN) model implementation function.

    Parameters
    ----------
    X_v : np.ndarray
        DESCRIPTION.
    X_a : np.ndarray
        DESCRIPTION.
    X_t : np.ndarray
        DESCRIPTION.
    multi_class : bool, optional
        Whether the model is configured for 2 classes or 7 classes classification. \
            The default is False.

    Returns
    -------
    TYPE
        DESCRIPTION.

    """
    in_v = Input(shape= X_v.shape[1:])
    in_a = Input(shape= X_a.shape[1:])
    in_t = Input(shape= X_t.shape[1:])
    
    # in_v = tf.reshape(in_v, [-1, in_v.shape[1] * in_v.shape[2]])
    # in_a = tf.reshape(in_a, [-1, in_a.shape[1] * in_a.shape[2]])
    # in_t = tf.reshape(in_t, [-1, in_t.shape[1] * in_t.shape[2]])
    
    d = 100
    d_dash = 400
    r = 150
    
    d_v = Dense(d)(in_v)
    d_a = Dense(d)(in_a)
    d_t = Dense(d)(in_t)
  
    d_v = tf.expand_dims(d_v, axis= 3)
    d_a = tf.expand_dims(d_a, axis= 3)
    d_t = tf.expand_dims(d_t, axis= 3)
    
    D = Concatenate(axis= 3)([d_v, d_a, d_t])
    
    A_d = ScaledDotProductAttention(d, d_dash, r)(D)
    
    A_d = tf.reshape(A_d, [-1, A_d.shape[1], A_d.shape[2]])
    
    H = Bidirectional(GRU(100, return_sequences=True))(A_d)
    
    flat = Flatten()(H)
    
    den = Dense(512, activation= 'tanh')(flat)
    den = Dropout(0.2)(den)
    den = Dense(128, activation= 'tanh')(den)
    den = Dropout(0.2)(den)
    den = Dense(128, activation= 'tanh')(den)
    den = Dropout(0.2)(den)
    den = Dense(32, activation= 'tanh')(den)
    den = Dropout(0.2)(den)
    if multi_class:
        out = Dense(7, activation= 'softmax')(den)    
    else:
        out = Dense(1, activation= 'sigmoid')(den)
    
    return Model(inputs= [in_v, in_a, in_t], outputs= out)
    

    # print(H.shape)
    
    # z_t_arr = np.zeros((H.shape[1], 2))
    
    # for t in range(H.shape[1]):
    #     P_t = Dense(H.shape[-1], activation= 'tanh')(H)
        
    #     print(P_t.shape)
        
    #     alpha_t = Dense(1, activation= 'softmax')(P_t)
        
    #     print(alpha_t.shape)
        
    #     H_transposed = tf.transpose(H, perm= [0, 2, 1])
    #     r_t = tf.matmul(H_transposed, alpha_t)
        
    #     print(r_t.shape)
        
    #     h_star_t = tf.tanh(r_t + H_transposed[:, t, :])
        
    #     z_t = Dense(2, activation= 'softmax')(h_star_t)
        
    #     z_t_arr[t] = z_t
    
    # return z_t_arr
