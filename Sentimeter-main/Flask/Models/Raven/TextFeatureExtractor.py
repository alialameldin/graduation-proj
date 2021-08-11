import os
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

from natsort import natsorted

current_path = os.path.dirname(os.path.abspath(__file__))

# loading glove word embeddings 

def pretrained_embeddings(file_path, EMBEDDING_DIM, VOCAB_SIZE, word2idx):  
    word2vec = {}
    with open(os.path.join(file_path),  errors='ignore', encoding='utf8') as f:
        for line in f:
            values = line.split(' ')
            word = values[0]
            vec = np.asarray(values[1:], dtype='float32')
            word2vec[word] = vec
    
    num_words = VOCAB_SIZE
    embedding_matrix = np.zeros((num_words, EMBEDDING_DIM))
    for word, i in word2idx.items():
      if i < VOCAB_SIZE:
          embedding_vector = word2vec.get(word)
          if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
    return embedding_matrix

# load data 

def extract_textual_features(data_directory_path, conf_files_path, extrapath=None):
    
    if extrapath == None:
        extrapath = os.path.join(conf_files_path, 'google-10000-english.txt')
    filenames = os.listdir(data_directory_path)
    data = []
    targets = []
    utterance=[]
    for filename in natsorted(filenames):
        lines = []
        with open(os.path.join(data_directory_path, filename) , 'r') as f:
            lines = f.readlines()
        utterance=[]
        for line in lines:
            word = line.split(' ')[0]
            utterance.append(word)
        
        data.append( utterance)

        
 
    targets = np.array(targets) 
    
    # Uploading most frequent 10000 words in english 
    
    most_frequent_10000_words = []
    with open(extrapath,  errors='ignore', encoding='utf8') as f:
            for line in f:
                most_frequent_10000_words.append(line.strip())
    
    # preprocess the data 
    
    tokenizer = Tokenizer(num_words= 13200, filters= '')
    
    # fit the tokenizer on most frequent 10000 words in english  and words in dataset
    
    tokenizer.fit_on_texts(most_frequent_10000_words+data) 
    seq = tokenizer.texts_to_sequences(data)
    
    seq_padded = pad_sequences(seq, padding= 'post',dtype='float32', maxlen=300)

    return seq_padded, tokenizer

def extract_textual_features_using_tokenizer(data_directory_path,tokenizer, conf_files_path, extrapath=None):
    if extrapath == None:
        extrapath = os.path.join(conf_files_path, 'google-10000-english.txt')
    
    filenames = os.listdir(data_directory_path)
    data = []
    targets = []
    utterance=[]
    for filename in natsorted(filenames):
        lines = []
        with open(os.path.join(data_directory_path, filename) , 'r') as f:
            lines = f.readlines()
        utterance=[]
        for line in lines:
            word = line.split(' ')[0]
            utterance.append(word)
        
        data.append( utterance)

        
 
    targets = np.array(targets) 
    
    # Uploading most frequent 10000 words in english 
    
    most_frequent_10000_words = []
    with open(extrapath,  errors='ignore', encoding='utf8') as f:
            for line in f:
                most_frequent_10000_words.append(line.strip())
    
    # preprocess the data 
    
    
    # fit the tokenizer on most frequent 10000 words in english  and words in dataset
    
    tokenizer.fit_on_texts(most_frequent_10000_words+data) 
    seq = tokenizer.texts_to_sequences(data)
    
    seq_padded = pad_sequences(seq, padding= 'post',dtype='float32', maxlen= 300)

    return seq_padded