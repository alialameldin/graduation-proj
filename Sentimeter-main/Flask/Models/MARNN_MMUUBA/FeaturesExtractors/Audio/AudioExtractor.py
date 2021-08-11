import os
import wave

import numpy as np
import opensmile


def extractFeatures(path):

    listDir = os.listdir(path)
    count = len(listDir)
    names = []
    features = []

    for i, filepath in enumerate(listDir):

        print(f"{count} files remaining...\n{filepath}\n\n")
        ch = wave.open(os.path.join(path, filepath)).getnchannels()
        
        if ch == 2:
            smile = opensmile.Smile(
                feature_set=opensmile.FeatureSet.eGeMAPSv02,
                feature_level=opensmile.FeatureLevel.Functionals,
                num_channels=2
            )
            y1 = smile.process_file(os.path.join(path, filepath))
            y1 = y1.iloc[0, :88]
            features.append(list(y1.values))

        if ch == 1:
            smile = opensmile.Smile(
                feature_set=opensmile.FeatureSet.eGeMAPSv02,
                feature_level=opensmile.FeatureLevel.Functionals,
                num_channels=1
            )
            y1 = smile.process_file(os.path.join(path, filepath))
            features.append(list(y1.iloc[0, :].values))
        names.append(filepath.split(".")[0])
        count -= 1

    features = np.array(features)
    names = np.array(names)
    names = np.reshape(names, (names.shape[0], 1))
    X = np.append(names, features, axis=1)
    
    return X
