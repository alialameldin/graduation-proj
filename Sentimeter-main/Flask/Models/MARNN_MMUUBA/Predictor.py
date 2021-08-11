import tensorflow as tf
import pickle
import numpy as np
import os


def create_mask( test_data, test_length):
    
        """
        # Arguments
            test data (any one modality (text, audio or video)), utterance lengths in test videos

        # Returns
            mask for test data
        """

        test_mask = np.zeros((test_data.shape[0], test_data.shape[1]), dtype='float')
        for i in range(len(test_length)):
            test_mask[i, :test_length[i]] = 1.0

        return test_mask


def predict(trainedModelPath, feat_ext_path):
    
    INPUT_PATH = os.path.join(feat_ext_path, os.pardir, 'input')
    model=tf.keras.models.load_model(trainedModelPath)
    
    (test_text, max_len , test_len) = pickle.load(
            open(os.path.join(INPUT_PATH, 'text.pickle'), 'rb'))
    (test_audio, _, _) = pickle.load(open(os.path.join(INPUT_PATH, 'audio.pickle'), 'rb'))
    (test_video, _, _) = pickle.load(open(os.path.join(INPUT_PATH, 'video.pickle'), 'rb'))
    
    test_mask = create_mask(test_text, test_len)
    
    test_predictions = model.predict([test_text, test_audio, test_video])
    
    predicted_label = []

    for i in range(test_predictions.shape[0]):
        for j in range(test_predictions.shape[1]):
            if test_mask[i, j] == 1:
                predicted_label.append(np.argmax(test_predictions[i, j]))
                
    return np.array(predicted_label)
    
    