import numpy as np
import pandas as pd
import tensorflow as tf
from .visual_data import detect_marks, get_face_detector, find_faces, get_landmark_model
from .acoustic_data import preprocess_audio_file
import os
import cv2
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

class PreparingData:
    '''
    
    PreparingData(data_base_path, labels_csv_path)

    Parameters
    ----------
    data_base_path : str
       the path of the base directory of the dataset.
    labels_csv_path : str
        the path of the labels csv file.

    Returns
    -------
    None.

    '''
    def __init__(self, data_base_path, labels_csv_path):
        if data_base_path[-1] != '/':
            data_base_path += '/'
        self.data_base_path = data_base_path
        
        self.labels = pd.read_csv(labels_csv_path)   
        self.labels.sort_values(by= 'video_name', inplace= True)
        self.labels.reset_index(inplace=True, drop=True)        
        self.Y = self.labels['label'].values.astype(np.int32)
        

    def load_acoustic_data(self, sr = 10000, n_fft = 2048, hop_length = 2048, n_mfcc = 12, maxlen= 100):
        data_directory_path = self.data_base_path + 'Audio/'
    
        filenames = os.listdir(data_directory_path)
        
        filenames = sorted(filenames)
        
        data = []
        
        for filename in filenames:
            file_path = data_directory_path + filename
            MFCC = preprocess_audio_file(file_path, sr= sr, n_fft=n_fft, hop_length=hop_length,
                                         n_mfcc=n_mfcc)
    
            data.append(MFCC)
        
        data = pad_sequences(data, padding= 'post', maxlen= maxlen)
        
        return data

    def load_text_data(self, maxlen= 100):
        data_directory_path = self.data_base_path + 'Text/'
        filenames = os.listdir(data_directory_path)
        glove_path = self.data_base_path + 'glove.42B.300d.txt'
        
        data = []
         
        word2vec = {}
        with open(os.path.join(glove_path),  errors='ignore', encoding='utf8') as f:
            for line in f:
                values = line.split(' ')
                word = values[0]
                vec = np.asarray(values[1:], dtype='float32')
                word2vec[word] = vec
        
        # load data
        filenames = sorted(filenames)
        for filename in filenames:
            with open(os.path.join(data_directory_path, filename), 'r') as f:
                data.append(f.read())
        
        # preprocess the data     
        tokenizer = Tokenizer(num_words= 10000, filters= '')
        tokenizer.fit_on_texts(data)
        seq = tokenizer.texts_to_sequences(data)
        seq_padded = pad_sequences(seq, padding= 'post', maxlen= maxlen)
        
        emb_matrix = np.zeros((len(data), seq_padded.shape[1], 300))
        
        for i, line in enumerate(data):
            words = line.lower().split(' ')
            for j, word in enumerate(words):
                if j == maxlen:
                    break
                vec = word2vec.get(word, np.zeros((300,)))
                emb_matrix[i, j, :] = vec
        
        return emb_matrix

    def load_visual_data(self, maxlen= 100):
        DATA_DIR = self.data_base_path + 'Video/'        
        filenames = os.listdir(DATA_DIR)
        
        filenames = sorted(filenames)
        
        def get_vid_frames(path):
            
            frames_one_vid = []
            cap = cv2.VideoCapture(path)            
            counter = 0
            
            while (True):
                ret,frame = cap.read()
                
                if not ret:
                    break
                
                counter += 1
                
                if counter % 30 == 0:    
                    frames_one_vid.append(frame)
                
            cap.release()
            cv2.destroyAllWindows()
            
            return np.array(frames_one_vid)
        
        facial_base_dir = '/ali/project/MultiModalSent/MultiModalSentimentAnalysis-master/DataPreparation/Facial Features/'
        face_model = get_face_detector(modelFile= facial_base_dir + 'res10_300x300_ssd_iter_140000.caffemodel',
                                       configFile= facial_base_dir + 'deploy.prototxt')
        
        landmark_model = get_landmark_model(facial_base_dir + 'pose_model.h5')
        
        data = []
        for filename in filenames:
            path = DATA_DIR + filename
            frames = get_vid_frames(path)
            features = []
            for frame in frames:
                face = find_faces(frame, face_model)
                if len(face) != 4:
                    continue
                marks = detect_marks(frame, landmark_model, face)
                if len(marks) == 0:
                    continue          
                features.append(marks.reshape(-1))
            data.append(np.array(features))
        
        data = pad_sequences(data, padding= 'post', maxlen= maxlen)
        return data
    
    def load_data(self, maxlen= 100):
        X_t = self.load_text_data(maxlen= maxlen)
        X_a = self.load_acoustic_data(maxlen= maxlen)
        X_v = self.load_visual_data(maxlen= maxlen)
        
        return X_v, X_a, X_t, self.Y
