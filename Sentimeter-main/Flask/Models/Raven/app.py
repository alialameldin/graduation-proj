import requests
from .raven import RavenModel
import os

def create_raven(data_path, conf_path, model_id, SERVER_URL):
    # requests.post(SERVER_URL + '/start_training/' + model_id, data= {'training': True})
    MODEL_SAVE_PATH = os.path.abspath(os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id, 'model_raven.h5'))
    
    raven = RavenModel(data_path, conf_path, model_id)
    raven.train()
    print('Finished training...')
    # accuracy = raven.get_accuracy()
    # if os.path.isfile(MODEL_SAVE_PATH):
    #     os.remove(MODEL_SAVE_PATH)
    
    # if os.path.isfile(os.path.abspath(os.path.join(MODEL_SAVE_PATH, os.pardir, 'raven_config_dict.pkl'))):
    #     os.remove(os.path.abspath(os.path.join(MODEL_SAVE_PATH, os.pardir, 'raven_config_dict.pkl')))
    
    # raven.save_model(MODEL_SAVE_PATH)
    
    # requests.post(SERVER_URL + '/finish_training/' + model_id,
    #               data= {'path': MODEL_SAVE_PATH, 'accuracy': accuracy*100})

def predict_raven(data_path, conf_path, model_id): 
    MODEL_LOAD_PATH = os.path.join(data_path, os.pardir, os.pardir, 'models_files', model_id, 'model_raven.h5')

    raven = RavenModel(data_path, conf_path, model_id)
    print('loading model...')
    raven.load_model(MODEL_LOAD_PATH)
    print('predicting on model...')
    preds = raven.predict(data_path)
    preds = preds.tolist()
    total = len(preds)
    count = 0
    for pred in preds:
        if pred[0] > 0.5:
            count += 1
    return (count * 100) / total
