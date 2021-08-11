from .FeaturesExtractor import FeaturesExtractor
from .Predictor import predict
from .Models import MMMUBA
from .Models import MARNN
import pickle
import requests
import os
import shutil
import tensorflow as tf

def create_marnn_mmuuba(model, data_path, model_id, SERVER_URL):
    #############Extract Features###################
    
    requests.post(SERVER_URL + '/start_training/' + model_id, data= {'training': True})

    feat_ext_path = os.path.abspath(os.path.join(os.getcwd(), 'Models', 'MARNN_MMUUBA', 'FeaturesExtractors'))
    fe = FeaturesExtractor(data_path, feat_ext_path, 0.7)

    a = fe.extractAudioFeatures(os.path.join(data_path, 'Audio'))
    t = fe.extractTextFeatures(os.path.join(data_path, 'Text'))
    v = fe.extractVisualFeatures(os.path.join(data_path, 'Video'))

    fe.prepareFeatures()

    # ####################Training the model##################################

    maxModel = None
    acc = None
    MODEL_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id)
    PICKLE_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id)

    if model == "mmmuba":        
        mmmuba = MMMUBA(feat_ext_path)
        maxModel, acc = mmmuba.train('MMMU_BA')
        MODEL_SAVE_PATH = os.path.join(MODEL_SAVE_PATH, 'model_mmmuba.h5')
        PICKLE_SAVE_PATH = os.path.join(PICKLE_SAVE_PATH, 'model_mmmuba.pickle')
        
    elif model == "mmuu-sa":        
        mmmuba = MMMUBA(feat_ext_path)
        maxModel, acc = mmmuba.train('mmuu_sa')
        MODEL_SAVE_PATH = os.path.join(MODEL_SAVE_PATH, 'model_mmuu-sa.h5')
        PICKLE_SAVE_PATH = os.path.join(PICKLE_SAVE_PATH, 'model_mmuu-sa.pickle')
        
    elif model == "mu-sa":        
        mmmuba = MMMUBA(feat_ext_path)
        maxModel, acc = mmmuba.train('mu_sa')
        MODEL_SAVE_PATH = os.path.join(MODEL_SAVE_PATH, 'model_mu-sa.h5')
        PICKLE_SAVE_PATH = os.path.join(PICKLE_SAVE_PATH, 'model_mu-sa.pickle')

    elif model == "marnn":
        marnn = MARNN(feat_ext_path)
        maxModel, acc = marnn.train(3, 0.0001)
        MODEL_SAVE_PATH = os.path.join(MODEL_SAVE_PATH, 'model_marnn.h5')
        PICKLE_SAVE_PATH = os.path.join(PICKLE_SAVE_PATH, 'model_marnn.pickle')
    
    
    if os.path.isfile(MODEL_SAVE_PATH):
        os.remove(MODEL_SAVE_PATH)

    if os.path.isfile(PICKLE_SAVE_PATH):
        os.remove(PICKLE_SAVE_PATH)
    
    tf.keras.models.save_model(maxModel, MODEL_SAVE_PATH)

    with open(PICKLE_SAVE_PATH, 'wb') as file:
        pickle.dump({"trainedModelPath":MODEL_SAVE_PATH,"maxLen":maxModel.layers[0].input_shape[0][1]}, file)
    
    requests.post(SERVER_URL + '/finish_training/' + model_id, data= {'path': MODEL_SAVE_PATH, 'accuracy': acc*100})
    
    shutil.rmtree(os.path.join(feat_ext_path, 'data'))
    shutil.rmtree(os.path.join(feat_ext_path, 'temp'))
    shutil.rmtree(os.path.join(feat_ext_path, os.pardir, 'input'))
    os.mkdir(os.path.join(feat_ext_path, os.pardir, 'input'))

def predict_marnn_mmuuba(model, data_path, model_id):
    PICKLE_SAVE_PATH = None
    if model == "mmmuba":        
        PICKLE_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir,
                                        'models_files', model_id, 'model_mmmuba.pickle')        
    elif model == "mmuu-sa":        
        PICKLE_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir,
                                        'models_files', model_id, 'model_mmuu-sa.pickle')        
    elif model == "mu-sa":        
        PICKLE_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir,
                                        'models_files', model_id, 'model_mu-sa.pickle')        

    elif model == "marnn":
        PICKLE_SAVE_PATH = os.path.join(data_path, os.pardir, os.pardir,
                                        'models_files', model_id, 'model_marnn.pickle')        


    load = pickle.load(open(PICKLE_SAVE_PATH, 'rb'))
    trainedModelPath=load["trainedModelPath"]
    maxLen=load["maxLen"]
    
    feat_ext_path = os.path.abspath(os.path.join(os.getcwd(), 'Models', 'MARNN_MMUUBA', 'FeaturesExtractors'))
    fe = FeaturesExtractor(data_path, feat_ext_path, 1)
    
    at=fe.extractAudioFeatures(os.path.join(data_path, 'Audio'),isTrain=False)
    tt=fe.extractTextFeatures(os.path.join(data_path, 'Text'),isTrain=False)
    vt=fe.extractVisualFeatures(os.path.join(data_path, 'Video'),isTrain=False)
    
    fe.prepareFeatures(isTrain=False, maxLen=maxLen)
    
    preds= predict(trainedModelPath, feat_ext_path)
    total = len(preds)
    count = sum(preds)
    
    shutil.rmtree(os.path.join(feat_ext_path, 'data'))
    shutil.rmtree(os.path.join(feat_ext_path, 'temp'))
    shutil.rmtree(os.path.join(feat_ext_path, os.pardir, 'input'))
    os.mkdir(os.path.join(feat_ext_path, os.pardir, 'input'))
    return (count * 100) / total
    
    
    
    
    
    
    
    
    
    
    
    
    