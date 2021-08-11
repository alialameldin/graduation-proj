import numpy as np
import os
import pandas as pd
from .FeaturesExtractors import createTrainData, createTestData
from .FeaturesExtractors.Visual import VisualExtractor
from .FeaturesExtractors.Audio import extractFeatures as audio_extract_features
from .FeaturesExtractors.Text import TextExtractor

class FeaturesExtractor:
    def __init__(self, data_path, features_extractors_path, ratio= 0.65):
        self.data_path = data_path
        self.features_extractors_path = features_extractors_path
        self.ratio = ratio
        self.labelsPath = os.path.join(data_path, "labels.csv")
        self.tempPath = os.path.join(features_extractors_path, 'temp')
        self.dataPath = os.path.join(features_extractors_path, 'data')
        self.textDataPath = os.path.join(self.dataPath, "text")
        self.audioDataPath = os.path.join(self.dataPath, "audio")
        self.videoDataPath = os.path.join(self.dataPath, "video")
        paths = [self.tempPath, self.dataPath, self.textDataPath, self.audioDataPath, self.videoDataPath]
    
        for path in paths:
            if not os.path.exists(path):
                os.makedirs(path)
                
    def extractAudioFeatures(self, rawAudioPath, isTrain=True):
        features = audio_extract_features(rawAudioPath)
    
        print(f"Extracted audio features shape : {features.shape}")
        
        data = None
        if isTrain:            
    
            data = self.appendLabels(features, self.labelsPath)
    
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Audio Features temp.csv", header=None, index=False)
    
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
    
            train, test = self.splitData(data, ratio=self.ratio)
        
            pd.DataFrame(train[:, 1:]).to_csv(f"{self.audioDataPath}/audio_train0.csv", header=None, index=False)
            pd.DataFrame(test[:, 1:]).to_csv(f"{self.audioDataPath}/audio_test0.csv", header=None, index=False)
        else:
            if not os.path.isfile(f"{self.tempPath}/testLabels.csv"):
                labls = np.zeros((features.shape[0], 2))
                labls = labls.astype(np.object)
                labls[:, 0] = features[:, 0]
                pd.DataFrame(labls).to_csv(f"{self.tempPath}/testLabels.csv", header=None, index=False)
    
            
            data = self.appendLabels(features, f"{self.tempPath}/testLabels.csv", isTrain=False)
    
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Audio Features temp.csv", header=None, index=False)
    
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
    
            pd.DataFrame(data[:, 1:]).to_csv(f"{self.audioDataPath}/audio_test1.csv", header=None, index=False)
        return data
    
    def extractTextFeatures(self, rawTextPath, isTrain= True):
        weights_path = os.path.join(self.features_extractors_path, 'Text', 'weights', 'GoogleNews-vectors-negative300.bin')
        model_path = os.path.join(self.features_extractors_path, 'Text', 'weights', 'textModelTwitterBEST.h5')
        preData_path = os.path.join(self.features_extractors_path, 'Text', 'preData.pickle')
    
        transcripts = self.readTxtFiles(rawTextPath)
        names = transcripts[:, 0].reshape((transcripts.shape[0], 1))
    
        X = np.array(transcripts[:, 1])
        X = X.reshape((transcripts.shape[0], 1))
    
        extractor = TextExtractor(X, model_path, weights_path, True, False, preData_path)
    
        features = extractor.extract()
    
        features = np.append(names, features, axis=1)
        
        data = None
        
        if isTrain:
            data = self.appendLabels(features, self.labelsPath)   
        
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Text Features temp.csv", header=None, index=False)
    
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
    
            train, test = self.splitData(data, ratio=self.ratio)

            pd.DataFrame(train[:, 1:]).to_csv(f"{self.textDataPath}/text_train0.csv", header=None, index=False)
        
            pd.DataFrame(test[:, 1:]).to_csv(f"{self.textDataPath}/text_test0.csv", header=None, index=False)
        
        else:
            if not os.path.isfile(f"{self.tempPath}/testLabels.csv"):
                labls = np.zeros((features.shape[0], 2))
                labls = labls.astype(np.object)
                labls[:, 0] = features[:, 0]
                pd.DataFrame(labls).to_csv(f"{self.tempPath}/testLabels.csv", header=None, index=False)
    
            
            data = self.appendLabels(features, f"{self.tempPath}/testLabels.csv", isTrain=False)
    
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Text Features temp.csv", header=None, index=False)
    
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
    
            pd.DataFrame(data[:, 1:]).to_csv(f"{self.textDataPath}/text_test1.csv", header=None, index=False)
        return data
    
    def extractVisualFeatures(self, rawDataPath, isTrain= True):
        img_rows, img_cols, img_depth = 112, 112, 16
        weights_path = os.path.join(self.features_extractors_path, 'Visual', 'weights', 'c3d.h5')
        print(weights_path)
        videos_path = rawDataPath
    
        visualExtractor = VisualExtractor()
        model, features = visualExtractor.extractFeatures(videos_path, weights_path, img_rows, img_cols, img_depth)
    
        data = None
        
        if isTrain:
            data = self.appendLabels(features, self.labelsPath)
    
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Visual Features temp.csv", header=None, index=False)
        
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
        
            train, test = self.splitData(data, ratio=self.ratio)
        
            pd.DataFrame(train[:, 1:]).to_csv(f"{self.videoDataPath}/video_train0.csv", header=None, index=False)
            pd.DataFrame(test[:, 1:]).to_csv(f"{self.videoDataPath}/video_test0.csv", header=None, index=False)
        
        else:
            if not os.path.isfile(f"{self.tempPath}/testLabels.csv"):
                labls = np.zeros((features.shape[0], 2))
                labls = labls.astype(np.object)
                labls[:, 0] = features[:, 0]
                pd.DataFrame(labls).to_csv(f"{self.tempPath}/testLabels.csv", header=None, index=False)
    
            
            data = self.appendLabels(features, f"{self.tempPath}/testLabels.csv", isTrain= False)
    
            pd.DataFrame(data).to_csv(f"{self.tempPath}/Visual Features temp.csv", header=None, index=False)
    
            pd.DataFrame(data[:, 0]).to_csv(f"{self.tempPath}/indexes.csv", header=None, index=True)
    
            pd.DataFrame(data[:, 1:]).to_csv(f"{self.videoDataPath}/video_test1.csv", header=None, index=False)  
        return data
    
    def appendLabels(self, features, labels_path, isTrain=True):
        print("Appending labels....")
        labels = None
        if isTrain:
            labels = pd.read_csv(labels_path, header=0)
            labels = np.array(labels)
        else:
            labels = np.array(pd.read_csv(labels_path, header=None))
            
        newFeatures = np.copy(features)
        
        appnd = []
        for i in range(labels.shape[0]):    
            for j in range(features.shape[0]):
                if features[j, 0] == labels[i, 0]:
                    appnd.append(labels[i, 1])
                    newFeatures[i] = features[j]
                    features = np.delete(features, j, 0)
                    break
    
        appnd = np.array(appnd)
        appnd = np.reshape(appnd, (appnd.shape[0], 1))
        newFeatures = np.append(newFeatures, appnd, axis=1)
    
        return newFeatures
    
    def splitData(self, features, ratio=0.65):
        train_len = int(features.shape[0] * ratio)
    
        train = features[:train_len, :]
        test = features[train_len:, :]
    
        print(train.shape)
        print(test.shape)
    
        return train, test

    def readTxtFiles(self, path):
        
        dirs = os.listdir( path )
        
        lines=np.zeros((len(dirs),2))
        lines=lines.astype(np.object)
        
        for row in range(len(dirs)):
            
            f = open(os.path.join(path,dirs[row]),"r")
            
            lines[row,0]=dirs[row].split(".")[0]
            lines[row,1]=f.readline()
            
            f.close()
        
        return lines
    
    
    
    def saveIndexes(self, split_ratio=0.65):
        features = np.array(pd.read_csv(f"{self.tempPath}/indexes.csv", header=None))
    
        train_len = int(features.shape[0] * split_ratio)
    
        train = features[:train_len, :]
        test = features[train_len:, :]
    
        pd.DataFrame(train).to_csv(f"{self.tempPath}/train_indexes.csv", header=None, index=False)
        pd.DataFrame(test).to_csv(f"{self.tempPath}/test_indexes.csv", header=None, index=False)
    
    
    
    
    
    def prepareFeatures(self, isTrain=True, maxLen=0):
        self.saveIndexes(self.ratio)
    
        modals = ["text", "video", "audio"]
        for modal in modals:
            if isTrain:
                createTrainData(modal, self.labelsPath, self.features_extractors_path)
            else:
                createTestData(modal, maxLen, self.features_extractors_path)
                
        # os.rmdir(self.tempPath)
        # os.rmdir(self.dataPath)
