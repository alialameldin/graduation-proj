import numpy as np
import pandas as pd
import os
import json
from natsort import natsorted
from .TextFeatureExtractor import extract_textual_features, extract_textual_features_using_tokenizer,pretrained_embeddings
from .AcousticFeatureExtractor import extract_acoustic_features
from .VisualFeatureExtractor import extract_visual_features
from .Splittingdata import PreprocessData
from shutil import rmtree

current_path = os.path.dirname(os.path.abspath(__file__))

def load_labels(data_path):
   
    csv_path = os.path.join(data_path, 'labels.csv')
    data_folder_path = data_path
    text_files_src = os.path.join(data_folder_path, 'Text')
    labels = pd.read_csv(csv_path)
    filenames= os.listdir(text_files_src)
    filenames= natsorted(filenames)
    targets = []
    for filename in filenames:

            current_labels = labels[labels['video_name']==os.path.splitext(filename)[0]]
            targets = targets + list(current_labels['label'].values)
    targets = np.reshape(targets, (len(targets), 1,1))
    return targets

def load_embedding_matrix( tokenizer, path= None):
    tokenizer_config = tokenizer.get_config()
    number_of_words = tokenizer_config['num_words']
    word2index = json.loads(tokenizer_config['word_index'])
    embedding_matrix = pretrained_embeddings(os.path.join(path, 'glove.42B.300d.txt'), 300, number_of_words,word2index)
    return embedding_matrix


def extract_features(data_path, model_id, conf_files_path):
    print('Splitting dataset...')
    splitted_data_path = PreprocessData(os.path.join(data_path, 'Audio'), os.path.join(data_path, 'Video'), model_id)

    # splitted_data_path = '/media/Work/Darkside/Graduation Project/raven_dataset'
    print('Extracting textual features...')
    textual_features, tokenizer = extract_textual_features(os.path.join(splitted_data_path, 'text'), conf_files_path)
    
    print('Extracting acoustic features...')
    acoustic_features = extract_acoustic_features(os.path.join(splitted_data_path, 'audio')\
                                      , os.path.join(splitted_data_path, 'text'))
    
    print('Extracting visual features...')
    visual_features = extract_visual_features(os.path.join(splitted_data_path, 'video')\
                                      , os.path.join(splitted_data_path, 'text'), conf_files_path)

    rmtree(splitted_data_path)
    acoustic_features = acoustic_features.numpy()
    visual_features = visual_features.numpy()
    
    
    
    visual_mean = visual_features.mean(axis=0)
    visual_std = visual_features.std(axis=0)
    visual_features = (visual_features - visual_mean) / (visual_std + 1e-6)
    
    acoustic_mean = acoustic_features.mean(axis=0)
    acoustic_std = acoustic_features.std(axis=0)
    acoustic_features = (acoustic_features - acoustic_mean) / (acoustic_std + 1e-6)
    

    
    config = {
        'tokenizer' : tokenizer,
        'acoustic': (acoustic_mean, acoustic_std),
        'visual': (visual_mean, visual_std),
        'text_shapes': textual_features.shape,
        'audio_shapes': acoustic_features.shape,
        'video_shapes': visual_features.shape,
        }
    
    return (textual_features, acoustic_features, visual_features), config
    
def extract_features_using_config(data_path, config, model_id, conf_files_path):
    splitted_data_path = PreprocessData(os.path.join(data_path, 'Audio'), os.path.join(data_path, 'Video'), model_id)
    
    textual_features = extract_textual_features_using_tokenizer(\
                       os.path.join(splitted_data_path, 'text'), config['tokenizer'], conf_files_path)
    
    acoustic_features = extract_acoustic_features(os.path.join(splitted_data_path, 'audio'), os.path.join(splitted_data_path, 'text'))
    
    visual_features = extract_visual_features(os.path.join(splitted_data_path, 'video'), os.path.join(splitted_data_path, 'text'), conf_files_path)
    rmtree(splitted_data_path)
    acoustic_features = acoustic_features.numpy()
    visual_features = visual_features.numpy()
    
    

    acoustic_features = (acoustic_features - config['acoustic'][0]) / (config['acoustic'][1] + 1e-6)
    
    visual_features = (visual_features - config['visual'][0]) / (config['visual'][1] + 1e-6)

    
    
    return (textual_features, acoustic_features, visual_features)
