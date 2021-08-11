from Models import MulT
from DataPreparation import PreparedData, PreparingData, shuffle, split
import tensorflow as tf
from tensorflow.keras.optimizers import Adam, Adagrad
from tensorflow.keras.losses import BinaryCrossentropy
import numpy as np
import time
import cv2
import matplotlib.pyplot as plt
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
from tensorflow.keras.utils import normalize
from tensorflow.keras.preprocessing.sequence import pad_sequences
# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

 
# Define a flask appp
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')

@app.route('/upload', methods=['GET','POST'])
def upload():
    # Main page
    if request.method == 'POST':
        
        print('is running')
        config = ConfigProto()
        config.gpu_options.allow_growth = True
        session = InteractiveSession(config=config)

        data_path = '/ali/project/Data/'
        preparing = PreparingData(data_path, data_path + 'labels_2classes.csv')

        X_v, X_a, X_t, Y = preparing.load_data()

        X_v, X_a, X_t, Y = shuffle(X_v, X_a, X_t, Y)

        X_v_train, X_v_valid, X_v_test = split(X_v)
        X_a_train, X_a_valid, X_a_test = split(X_a)
        X_t_train, X_t_valid, X_t_test = split(X_t)
        Y_train, Y_valid, Y_test = split(Y)

        model = MulT(X_v_train, X_a_train, X_t_train)

        model.compile(loss= 'categorical_crossentropy', optimizer= Adam(0.0001),
                      metrics= ['accuracy'])
              
        model.fit([X_v_train, X_a_train, X_t_train], Y_train, epochs= 10, batch_size= 1,
                  validation_data=([X_v_valid, X_a_valid, X_t_valid], Y_valid))

        model.save('static/model.h5')
        return render_template('index.html')
    
    return render_template('base.html')

if __name__ == '__main__':
    app.run(debug=True)
