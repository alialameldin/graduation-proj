from tensorflow.keras.layers import Conv1D, Dense, Concatenate, Input, Flatten
from tensorflow.keras.models import Model
from utils.MulT.Encoder import Encoder

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
    in_l = Input(shape= language_data.shape[1:], name= 'input_language')
    in_v = Input(shape= visual_data.shape[1:], name= 'input_visual')
    in_a = Input(shape= acoustic_data.shape[1:], name= 'input_acoustic')
    
    d_model = 40
    
    i_l = Conv1D(d_model, 3, name= 'i_language')(in_l)
    i_v = Conv1D(d_model, 3, name= 'i_visual')(in_v)
    i_a = Conv1D(d_model, 3, name= 'i_acoustic')(in_a)
    
    max_pos_enc_l = language_data.shape[1]
    max_pos_enc_v = visual_data.shape[1]
    max_pos_enc_a = acoustic_data.shape[1]
    
    enc_a_to_l = Encoder(4, d_model, 10, d_model, max_pos_enc_l, rate=0.2)(i_l, i_a, i_a, True)
    enc_v_to_l = Encoder(4, d_model, 10, d_model, max_pos_enc_l, rate=0.2)(i_l, i_v, i_v, True)
    
    enc_a_to_v = Encoder(4, d_model, 10, d_model, max_pos_enc_v, rate=0.2)(i_v, i_a, i_a, True)
    enc_l_to_v = Encoder(4, d_model, 10, d_model, max_pos_enc_v, rate=0.2)(i_v, i_l, i_l, True)
    
    enc_v_to_a = Encoder(4, d_model, 10, d_model, max_pos_enc_a, rate=0.2)(i_a, i_v, i_v, True)
    enc_l_to_a = Encoder(4, d_model, 10, d_model, max_pos_enc_a, rate=0.2)(i_a, i_l, i_l, True)
    
    conc_l = Concatenate(axis= 2, name= 'Concatenate_l')([enc_a_to_l, enc_v_to_l])
    conc_v = Concatenate(axis= 2, name= 'Concatenate_v')([enc_a_to_v, enc_l_to_v])
    conc_a = Concatenate(axis= 2, name= 'Concatenate_a')([enc_v_to_a, enc_l_to_a])
    
    trans_l = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_l, rate=0.2)(conc_l, conc_l, conc_l, True)
    trans_v = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_v, rate=0.2)(conc_v, conc_v, conc_v, True)
    trans_a = Encoder(4, 2*d_model, 10, d_model, max_pos_enc_a, rate=0.2)(conc_a, conc_a, conc_a, True)

    out_conc = Concatenate(axis= 1, name= 'Concatenate_Output')([trans_l, trans_v, trans_a])
    
    flatten = Flatten()(out_conc)
    
    out_1 = Dense(1, activation= 'sigmoid')(flatten)
    
    return Model(inputs= [in_v, in_a, in_l], outputs= out_1)
