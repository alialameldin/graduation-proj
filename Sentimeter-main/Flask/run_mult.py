from Models.MulT.mult import MulT
from Models.MulT.DataPreparation import split, shuffle, PreparingData, shuffle_data
import tensorflow as tf
from tensorflow.keras.utils import normalize
from tensorflow.keras.optimizers import Adam
import os
import matplotlib.pyplot as plt
import pickle

data_path = '/media/Work/Darkside/Graduation Project/Data'
MODEL_SAVE_PATH = os.path.abspath(os.path.join(os.getcwd(), 'model.h5'))

print('Starting preparing data...')    
preparing = PreparingData(data_path, os.path.join(data_path, 'labels.csv'))
X_v, X_a, X_t, Y = preparing.load_data()

X_v, X_a, X_t, Y = shuffle(X_v, X_a, X_t, Y)
X_v = normalize(X_v)
X_a = normalize(X_a)
X_t = normalize(X_t)

print('Starting splitting...')
X_v_train, X_v_valid = split(X_v)
X_a_train, X_a_valid = split(X_a)
X_t_train, X_t_valid = split(X_t)
Y_train, Y_valid = split(Y)

model = MulT(X_v_train, X_a_train, X_t_train)

# model.summary()

model.compile(loss= 'binary_crossentropy', optimizer= Adam(0.0001),
              metrics= ['accuracy'])
    
checkpoints = tf.keras.callbacks.ModelCheckpoint(MODEL_SAVE_PATH, monitor= 'val_accuracy', 
                                                 save_best_only=True, save_weights_only=True,
                                                 mode='auto', save_freq='epoch')

history = model.fit([X_v_train, X_a_train, X_t_train], Y_train, epochs= 100, batch_size= 128,
          validation_data=([X_v_valid, X_a_valid, X_t_valid], Y_valid),
          callbacks=[checkpoints])

plt.plot(history.history['accuracy'], label="Training Accuracy")
plt.plot(history.history['val_accuracy'], label="Validation Accuracy")
plt.legend()
plt.show()

plt.plot(history.history['loss'], label="Training Loss")
plt.plot(history.history['val_loss'], label="Validation Loss")
plt.legend()
plt.show()

model2 = MulT(X_v_train, X_a_train, X_t_train)
model2.load_weights(MODEL_SAVE_PATH)
model2.compile(loss= 'binary_crossentropy', optimizer= Adam(0.0001),
              metrics= ['accuracy'])

predictions = model2.predict([X_v_valid, X_a_valid, X_t_valid])

data = {
            'history': history.history,
            'predictions': predictions,
            'Y_valid': Y_valid
        }

with open('mult.pkl', 'wb') as file:
    pickle.dump(data, file, protocol=pickle.HIGHEST_PROTOCOL)