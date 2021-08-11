import os

import numpy as np

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import tensorflow as tf
import pickle
from .CNNFinal import CNNModel
from .utils.preprocess_data import PreprocessData


class TextExtractor:

    def __init__(self, transcripts, trainedWeightsPath, embeddingsWeightsPath, binary, no_header, preDataFile=None):

        self.modelWeightsPath = trainedWeightsPath
        self.embeddingsWeightsPath = embeddingsWeightsPath
        self.transcripts = transcripts
        self.binary = binary
        self.no_header = no_header
        self.preDataFile = preDataFile

        self._loadData()
        self._initModel()

    def _loadData(self):

        print("Loading preData.....")

        self.data = {}

        if self.preDataFile is not None:
            self.data = pickle.load(open(self.preDataFile, "rb"))
        else:
            print("preData.pickle file not found !!!")
            self.data = None

    def _initModel(self):

        print("Loading pretrained model.....")

        self.model = None
        self.finalModel = None

        if self.data is not None:

            wordsCount = self.data["weightsShape"][0]
            embeddingsShape = self.data["weightsShape"][1]
            maxSenLen = self.data["max_sen_len"]

            cnn = CNNModel(embeddingsShape, wordsCount, maxSenLen)
            self.model = cnn.initModel()
            self.model.load_weights(self.modelWeightsPath)
            self.finalModel = tf.keras.Model(inputs=self.model.input, outputs=self.model.layers[8].output)
            
            # self.finalModel = tf.keras.models.load_model(self.modelWeightsPath)

        else:
            print("preData.pickle file not found !!! Cannot load model.")

    def getModel(self):

        return self.model

    def preProcess(self):

        preData = PreprocessData(self.embeddingsWeightsPath, self.binary, self.no_header)

        if self.data is not None:
            preData.word2index = self.data["word2index"]
            preData.max_sen_len = self.data["max_sen_len"]
            x = preData.sent2Index(self.transcripts)
        else:
            x = preData.proprocess_data(self.transcripts)

        x = np.array(x)

        return x

    def extract(self):

        x = self.preProcess()

        print(x.shape)

        features = self.finalModel.predict(x, batch_size= 8)

        return features
