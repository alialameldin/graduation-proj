from .mult import MulT
from .DataPreparation import PreparingData, shuffle, split, shuffle_data
import tensorflow as tf
tf.executing_eagerly()
from tensorflow.keras.utils import normalize
from tensorflow.keras.optimizers import Adam
import os
import requests

def create_mult(data_path, model_id, SERVER_URL):
    X_v_train = None
    X_v_valid = None
    X_a_train = None
    X_a_valid = None
    X_t_train = None
    X_t_valid = None
    MODEL_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id, 'model.h5')
    
    requests.post(SERVER_URL + '/start_training/' + model_id, data= {'training': True})
    
    print('Starting preparing data...')    
    preparing = PreparingData(data_path, os.path.join(data_path, 'labels.csv'))
    X_v, X_a, X_t, Y = preparing.load_data()

    X_v, X_a, X_t, Y = shuffle(X_v, X_a, X_t, Y)
    X_v = normalize(X_v)
    X_a = normalize(X_a)
    X_t = normalize(X_t)

    print('Starting splitting...')
    X_v_train, X_v_valid = split(X_v)
    X_a_train, X_a_valid = split(X_a)
    X_t_train, X_t_valid = split(X_t)
    Y_train, Y_valid = split(Y)

    print('Starting training...')
    if os.path.isfile(MODEL_SAVE_PATH):
        os.remove(MODEL_SAVE_PATH)
    
    model = MulT(X_v_train, X_a_train, X_t_train)

    model.compile(loss= 'binary_crossentropy', optimizer= Adam(0.0001),
                  metrics= ['accuracy'])
    
    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor= 'val_loss',\
                                  factor= 0.1, patience= 10, min_lr= 1e-5)
            
    checkpoints = tf.keras.callbacks.ModelCheckpoint(MODEL_SAVE_PATH, monitor= 'val_accuracy', 
                                                     save_best_only=True, save_weights_only=True,
                                                     mode='auto', save_freq='epoch')

    model.fit([X_v_train, X_a_train, X_t_train], Y_train, epochs= 100, batch_size= 128,
              validation_data=([X_v_valid, X_a_valid, X_t_valid], Y_valid),
              callbacks=[reduce_lr, checkpoints])
    
    model2 = MulT(X_v_train, X_a_train, X_t_train)
    model2.load_weights(MODEL_SAVE_PATH)
    loss, accuracy = model2.evaluate([X_v, X_a, X_t], Y)
        
    requests.post(SERVER_URL + '/finish_training/' + model_id, data= {'path': MODEL_SAVE_PATH,
                                                                      'accuracy': accuracy*100})

def predict_mult(data_path, model_id):
    MODEL_LOAD_PATH = os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id, 'model.h5')
    
    print('Starting preparing data...')
    preparing = PreparingData(data_path, isTrain= False)
    X_v, X_a, X_t = preparing.load_data()

    X_v, X_a, X_t = shuffle_data(X_v, X_a, X_t)
    X_v = normalize(X_v)
    X_a = normalize(X_a)
    X_t = normalize(X_t)
    
    print('Starting predicting...')
    model = MulT(X_v, X_a, X_t)
    model.load_weights(MODEL_LOAD_PATH)
    
    preds = model.predict([X_v, X_a, X_t])
    preds = preds.tolist()
    total = len(preds)
    count = 0
    for pred in preds:
        if pred[0] > 0.5:
            count += 1
    return (count * 100) / total