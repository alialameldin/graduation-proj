import pandas as pd
import pickle
import numpy as np
import math
import os

class PreparedData:
    '''
        

    Parameters
    ----------
    data_name : str
        the name of desired dataset.
    aligned : bool, optional
        load the aligned data. The default is True.

    Raises
    ------
    ValueError
        DESCRIPTION.

    Returns
    -------
    None.

    '''
    def __init__(self, data_name, aligned= True):
        self.data_name = data_name
        self.aligned = aligned
        base_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'Data'))
        filename = ''
        if self.data_name == 'mosi':
            if self.aligned:
                filename = 'mosi_data.pkl'
            else:
                filename = 'mosi_data_noalign.pkl'
        elif self.data_name == 'mosei':
            if self.aligned:
                filename = 'mosei_senti_data.pkl'
            else:
                filename = 'mosei_senti_data_noalign.pkl'
        else:
            raise ValueError('There is no prepared data with that name')
        
        self.data = pd.read_pickle(os.path.join(base_path, filename))
    
    def load_data(self, splitted= False):
        '''
        

        Parameters
        ----------
        splitted : bool, optional
            Load training, Validation, and testing data separated. The default is False.

        '''
        X_tr_v = self.data['train']['vision']
        X_tr_t = self.data['train']['text']
        X_tr_a = self.data['train']['audio']
        X_tr_l = np.where(np.array(self.data['train']['labels']).astype(np.int32) > 0,
                                       int(1), int(0))
        
        X_te_v = self.data['test']['vision']
        X_te_t = self.data['test']['text']
        X_te_a = self.data['test']['audio']
        X_te_l = np.where(np.array(self.data['test']['labels']).astype(np.int32) > 0,
                                       int(1), int(0))
        
        X_val_v = self.data['valid']['vision']
        X_val_t = self.data['valid']['text']
        X_val_a = self.data['valid']['audio']
        X_val_l = np.where(np.array(self.data['valid']['labels']).astype(np.int32) > 0,
                                       int(1), int(0))
        
        if splitted:
            return ( X_tr_v, X_tr_a, X_tr_t, X_tr_l.reshape(-1)), \
                (X_te_v, X_te_a, X_te_t, X_te_l.reshape(-1)), \
                    (X_val_v, X_val_a, X_val_t, X_val_l.reshape(-1))
        
        X_v = np.concatenate((X_tr_v, X_te_v, X_val_v)).astype(np.float32)
        X_a = np.concatenate((X_tr_a, X_te_a, X_val_a)).astype(np.float32)
        X_t = np.concatenate((X_tr_t, X_te_t, X_val_t)).astype(np.float32)
        Y = np.concatenate((X_tr_l, X_te_l, X_val_l)).reshape(-1).astype(np.int32)
        
        return X_v, X_a, X_t, Y
            
    def __get_Processed_train(self): 
        for i in range(self.X_train_labels.shape[0]):
            if (self.X_train_labels[i]>0):
                self.X_train_labels[i] = int(1)
            else:
                self.X_train_labels[i] = int(0)
            
        for i in range(self.X_train_vision.shape[0]):
            for j in range(self.X_train_vision.shape[1]):
                for k in range(self.X_train_vision.shape[2]):
                    if (np.isnan(self.X_train_vision[i][j][k]) or math.isinf(self.X_train_vision[i][j][k]) ):
                        self.X_train_vision[i][j][k] = 0
    
    
        for i in range(self.X_train_audio.shape[0]):
            for j in range(self.X_train_audio.shape[1]):
                for k in range(self.X_train_audio.shape[2]):
                    if (np.isnan(self.X_train_audio[i][j][k]) or math.isinf(self.X_train_audio[i][j][k]) ):
                        self.X_train_audio[i][j][k] = 0
    
        for i in range(self.X_train_text.shape[0]):
            for j in range(self.X_train_text.shape[1]):
                for k in range(self.X_train_text.shape[2]):
                    if (np.isnan(self.X_train_text[i][j][k]) or math.isinf(self.X_train_text[i][j][k]) ):
                        self.X_train_text[i][j][k] = 0
                        
        return self.X_train_vision, self.X_train_audio, self.X_train_text, self.X_train_labels
    
    
    def __get_Processed_test(self):
        
        for i in range(self.X_test_labels.shape[0]):
            if (self.X_test_labels[i]>0):
                self.X_test_labels[i] = int(1)
            else:
                self.X_test_labels[i] = int(0)
        
        for i in range(self.X_test_vision.shape[0]):
            for j in range(self.X_test_vision.shape[1]):
                for k in range(self.X_test_vision.shape[2]):
                    if (np.isnan(self.X_test_vision[i][j][k]) or math.isinf(self.X_test_vision[i][j][k]) ):
                        self.X_test_vision[i][j][k] = 0
    
        for i in range(self.X_test_audio.shape[0]):
            for j in range(self.X_test_audio.shape[1]):
                for k in range(self.X_test_audio.shape[2]):
                    if (np.isnan(self.X_test_audio[i][j][k]) or math.isinf(self.X_test_audio[i][j][k]) ):
                        self.X_test_audio[i][j][k] = 0
    
        for i in range(self.X_test_text.shape[0]):
            for j in range(self.X_test_text.shape[1]):
                for k in range(self.X_test_text.shape[2]):
                    if (np.isnan(self.X_test_text[i][j][k]) or math.isinf(self.X_test_text[i][j][k]) ):
                        self.X_test_text[i][j][k] = 0
                        
        return self.X_test_vision, self.X_test_audio, self.X_test_text, self.X_test_labels       
    
    def __get_Processed_valid(self):
        
        for i in range(self.X_valid_labels.shape[0]):
            if (self.X_valid_labels[i]>0):
                self.X_valid_labels[i] = int(1)
            else:
                self.X_valid_labels[i] = int(0)
            
        for i in range(self.X_valid_vision.shape[0]):
            for j in range(self.X_valid_vision.shape[1]):
                for k in range(self.X_valid_vision.shape[2]):
                    if (np.isnan(self.X_valid_vision[i][j][k]) or math.isinf(self.X_valid_vision[i][j][k]) ):
                        self.X_valid_vision[i][j][k] = 0
    
        for i in range(self.X_valid_audio.shape[0]):
            for j in range(self.X_valid_audio.shape[1]):
                for k in range(self.X_valid_audio.shape[2]):
                    if (np.isnan(self.X_valid_audio[i][j][k]) or math.isinf(self.X_valid_audio[i][j][k]) ):
                        self.X_test_audio[i][j][k] = 0
    
        for i in range(self.X_valid_text.shape[0]):
            for j in range(self.X_valid_text.shape[1]):
                for k in range(self.X_valid_text.shape[2]):
                    if (np.isnan(self.X_valid_text[i][j][k]) or math.isinf(self.X_valid_text[i][j][k]) ):
                        self.X_valid_text[i][j][k] = 0
                        
        return self.X_valid_vision, self.X_valid_audio, self.X_valid_text, self.X_valid_labels

