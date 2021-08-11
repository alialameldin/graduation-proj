import numpy as np, pandas as pd
from collections import defaultdict
import pickle
from sklearn import preprocessing
from pathlib import Path
import os




def createTrainData(name, labelsPath, feat_ext_path): # baddy lel main t7t esm el 7aga elly hy2ra el data bta3tha (text or video or audio)

    np.random.seed(17)

    pre_data = np.asarray(pd.read_csv(labelsPath))

    train = pd.read_csv(os.path.join(feat_ext_path, 'temp', 'train_indexes.csv'), header=None)
    test = pd.read_csv(os.path.join(feat_ext_path, 'temp', 'test_indexes.csv'), header=None)
    train = np.asarray(train)
    test = np.asarray(test)
    train_index = np.asarray(train[:,0], dtype = 'int') # el index bta3 el uttarance bta3t el train
    test_index = np.asarray(test[:,0], dtype = 'int' ) # el index bta3 el uttarance bta3t el test
    
    
    path = os.path.join(feat_ext_path, 'data', name, name)
    #print (path)
    train_video_mapping=defaultdict(list) # defaultdic da 3obara 3n dictionary bs leeh default value , fe 7alet enk nadeet 7aga much mwgooda byrf3lk el default value much bytl3 error wel el default value hna empty list 
    train_video_mapping_index=defaultdict(list)
    test_video_mapping=defaultdict(list)
    test_video_mapping_index=defaultdict(list)

    data_train = np.asarray(pd.read_csv(path+"_train0.csv", header=None)) # train data but for certain type ((text or video or audio))
    data_test = np.asarray(pd.read_csv(path+"_test0.csv", header=None)) # test data but for certain type ((text or video or audio))
    
    # hna hmchy 3la el training data
    print('Creating Data...')
    for i in range(train_index.shape[0]):
        # bna5od esm el utterance say 1DmNV9C1hbY_10 awl goz2 mnoh da esm el video , we elly b3d el "_" da rqm el utterance gowa el video 
        train_video_mapping[pre_data[train_index[i]][0].rsplit("_",1)[0] ].append(train_index[i]) #rqm el uttarence btween the utterances+1 3achan howa bade2 mn zero wel csv btbd2 mn 1 (check transcript file)
        train_video_mapping_index[pre_data[train_index[i]][0].rsplit("_",1)[0] ].append( int(pre_data[train_index[i]][0].rsplit("_",1)[1]) )#rqm el uttarence in the video
      
    # hna hmchy 3la el test data
    
    for i in range(test_index.shape[0]):
        test_video_mapping[pre_data[test_index[i]][0].rsplit("_",1)[0] ].append(test_index[i])
        test_video_mapping_index[pre_data[test_index[i]][0].rsplit("_",1)[0] ].append( int(pre_data[test_index[i]][0].rsplit("_",1)[1]) )

    train_indices = dict((c, i) for i, c in enumerate(train_index)) # b map el index bta3 el utterance b index bybd2 mn 0 3ady
    test_indices = dict((c, i) for i, c in enumerate(test_index))
    
    #b7awel ageeb aktr video 3ndoh 3dd mn el utterances
    max_len = 100
    # for key,value in train_video_mapping.items():
    #     max_len = max(max_len , len(value))
    # for key,value in test_video_mapping.items():
    #     max_len = max(max_len, len(value))

    pad = np.asarray([0 for i in range(data_train[0][:-1].shape[0])]) # de padding b zeroes hyst5dmha b3deen 

    print ("Mapping train")

    train_data_X =[]
    train_data_Y =[]
    train_length =[]
    for key,value in train_video_mapping.items(): # hmchy 3la video video (moch utterance)

        
        lst = np.column_stack((train_video_mapping_index[key],value)  ) #bylz2 rqm el utterence between utterences b rqm el utterance inside a video
        ind = np.asarray(sorted(lst,key=lambda x: x[0])) # b3d kda b3mlhom sort b rqm el utterence inside el video 


        lst_X, lst_Y=[],[]
        ctr=0;
        for i in range(ind.shape[0]):
            ctr+=1 # counter for number of Training utterences inside this vid
            #Bybd2 ya5od el training Input data we el label bto3 el 7aga elly ana sha8al 3aleeha (text,audio,video) we bysavehom fe lst_X we lst_Y
            lst_X.append(data_train[train_indices[ind[i,1]]][:-1])
            lst_Y.append(data_train[train_indices[ind[i,1]]][-1])
        train_length.append(ctr)
        for i in range(ctr, max_len): # 3awz a5ally kol video 3ndo nfs 3dd el utterence elly howa el max_len f hadeef padding b zeroes le kol video 3dd el utterences feeh 22l mn max_len 
            lst_X.append(pad)
            lst_Y.append(0) #dummy label
        
        train_data_X.append(lst_X)
        train_data_Y.append(lst_Y)
    

    test_data_X =[]
    test_data_Y =[]
    test_length =[]

    print ("Mapping test")

    for key,value in test_video_mapping.items():

        lst = np.column_stack((test_video_mapping_index[key],value)  )
        ind = np.asarray(sorted(lst,key=lambda x: x[0]))

        lst_X, lst_Y=[],[]
        ctr=0
        for i in range(ind.shape[0]):
            ctr+=1
            #lst_X.append(preprocessing.scale( min_max_scaler.transform(data_test[test_indices[ind[i,1]]][:-1])))
            lst_X.append(data_test[test_indices[ind[i,1]]][:-1])
            lst_Y.append(data_test[test_indices[ind[i,1]]][-1])
        test_length.append(ctr)
        for i in range(ctr, max_len):
            lst_X.append(pad)
            lst_Y.append(0) #dummy label

        test_data_X.append(np.asarray(lst_X))
        test_data_Y.append(np.asarray(lst_Y))

    train_data_X = np.asarray(train_data_X)
    test_data_X = np.asarray(test_data_X)
    #print (train_data_X.shape, test_data_X.shape,len(train_length), len(test_length))
    INPUT_PATH = os.path.join(feat_ext_path, os.pardir, 'input')
    Path(INPUT_PATH).mkdir(exist_ok=True)
    print ("Dumping data") #hna hn save el date fe pickle files
    with open(os.path.join(INPUT_PATH, name+'.pickle'), 'wb') as handle:
        pickle.dump((train_data_X,  np.asarray(train_data_Y), test_data_X, np.asarray(test_data_Y), max_len ,train_length, test_length), handle, protocol=pickle.HIGHEST_PROTOCOL)
        # el data elly httsave fel pickle file htb2a 3d (3dd el videos elly howa 62 fe el train we 31 fe el test , 3dd elutterence elly howa 63 b3d el padding,100 elly heya 3dd el features)
    print(f"Saved as input/{name}.pickle")

def createTestData(name, maxLen, feat_ext_path): # baddy lel main t7t esm el 7aga elly hy2ra el data bta3tha (text or video or audio)

    np.random.seed(17)

    pre_data = np.asarray(pd.read_csv(os.path.join(feat_ext_path, 'temp', 'testLabels.csv') , header=None))

    test = pd.read_csv(os.path.join(feat_ext_path, 'temp', 'indexes.csv'), header=None)
    test = np.asarray(test)
    test_index = np.asarray(test[:,0], dtype = 'int' ) # el index bta3 el uttarance bta3t el test
    
    
    path = os.path.join(feat_ext_path, 'data', name, name)
    
    test_video_mapping=defaultdict(list)
    test_video_mapping_index=defaultdict(list)

    data_test = np.asarray(pd.read_csv(path+"_test1.csv", header=None)) # test data but for certain type ((text or video or audio))

    # hna hmchy 3la el test data
    
    for i in range(test_index.shape[0]):
        test_video_mapping[pre_data[test_index[i]][0].rsplit("_",1)[0] ].append(test_index[i])
        test_video_mapping_index[pre_data[test_index[i]][0].rsplit("_",1)[0] ].append( int(pre_data[test_index[i]][0].rsplit("_",1)[1]) )

    test_indices = dict((c, i) for i, c in enumerate(test_index))
    
    max_len = maxLen    

    pad = np.asarray([0 for i in range(data_test[0][:-1].shape[0])]) # de padding b zeroes hyst5dmha b3deen 
    

    test_data_X =[]
    test_data_Y =[]
    test_length =[]

    print ("Mapping test")

    for key,value in test_video_mapping.items():

        lst = np.column_stack((test_video_mapping_index[key],value)  )
        ind = np.asarray(sorted(lst,key=lambda x: x[0]))

        lst_X, lst_Y=[],[]
        ctr=0
        for i in range(ind.shape[0]):
            ctr+=1
            #lst_X.append(preprocessing.scale( min_max_scaler.transform(data_test[test_indices[ind[i,1]]][:-1])))
            lst_X.append(data_test[test_indices[ind[i,1]]][:-1])
            lst_Y.append(data_test[test_indices[ind[i,1]]][-1])
        test_length.append(ctr)
        for i in range(ctr, max_len):
            lst_X.append(pad)
            lst_Y.append(0) #dummy label

        test_data_X.append(np.asarray(lst_X))
        test_data_Y.append(np.asarray(lst_Y))

    test_data_X = np.asarray(test_data_X)
    
    INPUT_PATH = os.path.join(feat_ext_path, os.pardir, 'input')
    Path(INPUT_PATH).mkdir(parents=True, exist_ok=True)
    print ("Dumping data") #hna hn save el date fe pickle files
    
    with open(os.path.join(INPUT_PATH, name+'.pickle'), 'wb') as handle:
        pickle.dump((test_data_X, max_len , test_length), handle, protocol=pickle.HIGHEST_PROTOCOL)

    print(f"Saved as input/Test/{name}.pickle")



    
