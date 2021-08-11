import pandas as pd
import numpy as np

data = pd.read_csv('../Data/OpinionLevelSentiment.csv', header= None)
data.drop([0, 1], axis= 1, inplace= True)
data['video_name'] = data[2] + '_' + data[3].astype(str)
data.drop([2, 3], axis= 1, inplace= True)
data.columns = ['label', 'video_name']
data = data[['video_name', 'label']]


data7 = data.copy()
data7['label'] = np.round(data7['label']).astype(np.int32)
data7['label'].value_counts()

# data.to_csv('./Data/labels_7classes.csv')

data2 = data.copy()
data2['label'] = data2['label'] > 0.9
data2['label'] = data2['label'].astype(np.int32)
data2['label'].value_counts()

data2.to_csv('./labels_2classes.csv', index= False)
data7.to_csv('./labels_7classes.csv', index= False)

    