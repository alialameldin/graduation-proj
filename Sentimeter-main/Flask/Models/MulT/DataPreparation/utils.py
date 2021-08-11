import numpy as np

def shuffle(X_v, X_a, X_t, Y):
    shuffler = np.random.permutation(len(X_v))
    X_v = X_v[shuffler]
    X_a = X_a[shuffler]
    X_t = X_t[shuffler]
    Y = Y[shuffler]    
    return X_v, X_a, X_t, Y

def shuffle_data(X_v, X_a, X_t):
    shuffler = np.random.permutation(len(X_v))
    X_v = X_v[shuffler]
    X_a = X_a[shuffler]
    X_t = X_t[shuffler]   
    return X_v, X_a, X_t

def split(X):  
    n = len(X)
    X_train = X[0: int(n*0.8)]
    X_valid = X[int(n*0.8):]
    return X_train, X_valid