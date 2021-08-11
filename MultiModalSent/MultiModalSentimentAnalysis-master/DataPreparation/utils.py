import numpy as np

def shuffle(X_v, X_a, X_t, Y):
    shuffler = np.random.permutation(len(X_v))
    X_v = X_v[shuffler]
    X_a = X_a[shuffler]
    X_t = X_t[shuffler]
    Y = Y[shuffler]    
    return X_v, X_a, X_t, Y

def split(X):  
    n = len(X)
    X_train = X[0: int(n*0.7)]
    X_test = X[int(n*0.7): int(n*0.85)]
    X_valid = X[int(n*0.85):]
    return X_train, X_valid, X_test