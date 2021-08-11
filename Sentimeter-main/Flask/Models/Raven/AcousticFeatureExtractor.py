import librosa
import numpy as np
import os
from natsort import natsorted
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf






def ExractAcousticFeatures(filename):

    signalintime , samplerate = librosa.load(filename, sr =16000)
    
    MFCC = librosa.feature.mfcc(signalintime, sr=samplerate, n_fft=1024, hop_length=512, n_mfcc = 13)
    MFCC = np.transpose(MFCC)
    return MFCC


def extract_acoustic_features(audio_path,text_path,features_path=os.getcwd() , SaveFeatures=False):
    filenames_text= natsorted(os.listdir(text_path))
    
    
    data = []
    filenames= os.listdir(audio_path)
    filenames= natsorted(filenames)
    num_of_files= len(filenames)
    
    for filename in filenames:
        
        MFCC= ExractAcousticFeatures(os.path.join(audio_path, filename))
        
        data.append(MFCC)
        
        
    final_data = pad_sequences(data, padding= 'post', dtype='float32', maxlen=300) #check kda a-limit max num of frames wla la
    print(final_data.shape)
    start=0
    end=0
    i=0
    utterance_count=0
    temp=[]
    
    for filename in natsorted(filenames):
        if os.path.splitext(filenames_text[utterance_count])[0] in os.path.splitext(filename)[0]:  # seglist.append(MFCC)
                i+=1
                start=end
                
                if i == num_of_files -1:
                    temp.append(final_data[start:i,:,:])
        else:
            end=i
            temp.append(final_data[start:end,:,:])
            i+=1
            utterance_count+=1

    

        
    temp = pad_sequences(temp, padding= 'post', maxlen=300, dtype='float32')
    temp=tf.stack( temp, axis=0)
    x = temp.shape
    if SaveFeatures==True:
        with open( os.path.join(features_path, 'Acousticfeatures74.pkl'), 'wb') as handle:
            pickle.dump(temp, handle, protocol=pickle.HIGHEST_PROTOCOL)
    return   temp
  