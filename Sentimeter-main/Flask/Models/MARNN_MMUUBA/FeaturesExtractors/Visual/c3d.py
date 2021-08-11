import os

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import tensorflow as tf


class C3D:
    def __init__(self, input_shape, weights_path=None):
        with tf.device('/cpu:0'):
            self.weights_path = weights_path

            ##C3D model pretrained on sports1m dataset which consists of 487 classes.

            self.inp = tf.keras.layers.Input(input_shape)

            self.conv1a = tf.keras.layers.Conv3D(64, 3, 1, padding="same", activation="relu",
                                                 input_shape=input_shape[1:])
            self.pool1 = tf.keras.layers.MaxPool3D((1, 2, 2), (1, 2, 2), padding="valid")

            self.conv2a = tf.keras.layers.Conv3D(128, 3, 1, padding="same", activation="relu")
            self.pool2 = tf.keras.layers.MaxPool3D((2, 2, 2), (2, 2, 2), padding="valid")

            self.conv3a = tf.keras.layers.Conv3D(256, 3, 1, padding="same", activation="relu")
            self.conv3b = tf.keras.layers.Conv3D(256, 3, 1, padding="same", activation="relu")
            self.pool3 = tf.keras.layers.MaxPool3D((2, 2, 2), (2, 2, 2), padding="valid")

            self.conv4a = tf.keras.layers.Conv3D(512, 3, 1, padding="same", activation="relu")
            self.conv4b = tf.keras.layers.Conv3D(512, 3, 1, padding="same", activation="relu")
            self.pool4 = tf.keras.layers.MaxPool3D((2, 2, 2), (2, 2, 2), padding="valid")

            self.conv5a = tf.keras.layers.Conv3D(512, 3, 1, padding="same", activation="relu")
            self.conv5b = tf.keras.layers.Conv3D(512, 3, 1, padding="same", activation="relu")
            self.zeropad = tf.keras.layers.ZeroPadding3D(padding=((0, 0), (0, 1), (0, 1)))
            self.pool5 = tf.keras.layers.MaxPool3D((2, 2, 2), (2, 2, 2), padding="valid")

            self.flat = tf.keras.layers.Flatten()

            self.fc6 = tf.keras.layers.Dense(4096, activation="relu")
            self.dropout1 = tf.keras.layers.Dropout(0.5)

            self.fc7 = tf.keras.layers.Dense(4096, activation="relu")
            self.dropout2 = tf.keras.layers.Dropout(0.5)

            self.fc8 = tf.keras.layers.Dense(487, activation="softmax")

    def generateModel(self):
        with tf.device('/cpu:0'):
            x = self.conv1a(self.inp)
            x = self.pool1(x)
            print(x.shape)

            x = self.conv2a(x)
            x = self.pool2(x)
            print(x.shape)

            x = self.conv3a(x)
            x = self.conv3b(x)
            x = self.pool3(x)
            print(x.shape)

            x = self.conv4a(x)
            x = self.conv4b(x)
            x = self.pool4(x)
            print(x.shape)

            x = self.conv5a(x)
            x = self.conv5b(x)
            x = self.zeropad(x)
            x = self.pool5(x)
            print(x.shape)

            x = self.flat(x)

            x = self.fc6(x)
            x = self.dropout1(x)

            x = self.fc7(x)
            x = self.dropout2(x)

            out = self.fc8(x)
            print(out.shape)

            model = tf.keras.Model(inputs=self.inp, outputs=out)
            if self.weights_path is not None:
                model.load_weights(self.weights_path)

        return model
