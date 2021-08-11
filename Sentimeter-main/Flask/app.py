from flask import Flask, request, jsonify
app = Flask(__name__)
import os
from Models.MulT import create_mult, predict_mult
from Models.Raven import create_raven, predict_raven
from Models.MARNN_MMUUBA import create_marnn_mmuuba, predict_marnn_mmuuba
from multiprocessing import Process
from splitting import split_to_utts
from time import time

p1 = None

@app.route('/')
def hello():
    return '<h1>Welcome to Sentimeter Flask API</h1>'

@app.route('/create_model', methods=["POST"])
def create_model():
    data = request.get_json(force= True)
    model_id = data['model_id']
    model_arch = data['model_arch']
    
    DATA_BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'Back-end', 'static',
                                                 'data', model_id))
    CONFIG_DIR = os.path.abspath(os.path.join(os.getcwd(), 'Config'))
    SERVER_URL = 'https://api.sentimeter.dev/api/flask'
    
    p1 = None
    
    if model_arch.lower() == 'mult':
        p1 = Process(target=create_mult, args=(DATA_BASE_DIR, model_id, SERVER_URL))
        p1.start()
    elif model_arch.lower() == 'raven':
        p1 = Process(target=create_raven, args=(DATA_BASE_DIR, CONFIG_DIR, model_id, SERVER_URL))
        p1.start()
    elif model_arch.lower() == 'mmmu-ba':
        p1 = Process(target=create_marnn_mmuuba, args=('mmmuba', DATA_BASE_DIR, model_id, SERVER_URL))
        p1.start()
    elif model_arch.lower() == 'mmuu-sa':
        p1 = Process(target=create_marnn_mmuuba, args=('mmuu-sa', DATA_BASE_DIR, model_id, SERVER_URL))
        p1.start()
    elif model_arch.lower() == 'mu-sa':
        p1 = Process(target=create_marnn_mmuuba, args=('mu-sa', DATA_BASE_DIR, model_id, SERVER_URL))
        p1.start()
    elif model_arch.lower() == 'marnn':
        p1 = Process(target=create_marnn_mmuuba, args=('marnn', DATA_BASE_DIR, model_id, SERVER_URL))
        p1.start()
    
    return 'Model received successfully', 200

@app.route('/predict', methods=["POST"])
def predict_model():
    data = request.get_json(force= True)
    model_id = data['model_id']
    model_arch = data['model_arch']
    DATA_BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'Back-end', 'static',
                                                 'videos_predict', model_id))
    CONFIG_DIR = os.path.abspath(os.path.join(os.getcwd(), 'Config'))

    split_to_utts(os.path.join(DATA_BASE_DIR, 'predict.mp4'), DATA_BASE_DIR)
    
    return 'hey', 200

    prediction = None
    if model_arch.lower() == 'mult':
        prediction = predict_mult(DATA_BASE_DIR, model_id)
    elif model_arch.lower() == 'raven':
        prediction = predict_raven(DATA_BASE_DIR, CONFIG_DIR, model_id)
    elif model_arch.lower() == 'mmmu-ba':
        prediction = predict_marnn_mmuuba('mmmuba', DATA_BASE_DIR, model_id)
    elif model_arch.lower() == 'mmuu-sa':
        prediction = predict_marnn_mmuuba('mmuu-sa', DATA_BASE_DIR, model_id)
    elif model_arch.lower() == 'mu-sa':
        prediction = predict_marnn_mmuuba('mu-sa', DATA_BASE_DIR, model_id)
    elif model_arch.lower() == 'marnn':
        prediction = predict_marnn_mmuuba('marnn', DATA_BASE_DIR, model_id)
    
    return jsonify(prediction=round(prediction, 2)), 200

app.run(host= '0.0.0.0', port= 8000)
