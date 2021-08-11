import tensorflow as tf


class CNNModel:

    def __init__(self, embeddingsSize, wordsCount, sentenceLength):
        self.wordsCount = wordsCount
        self.sentenceLength = sentenceLength
        self.embeddingsSize = embeddingsSize

    def _initLayers(self):
        shape = int(self.sentenceLength)

        self.inp = tf.keras.layers.Input(shape=shape)

        self.embedding = tf.keras.layers.Embedding(self.wordsCount, self.embeddingsSize,
                                                   input_length=self.sentenceLength,
                                                   trainable=False, mask_zero=True)

        self.spatialDrop = tf.keras.layers.SpatialDropout1D(0.4)

        self.conv1d_1 = tf.keras.layers.Conv1D(128, 7, activation='relu', padding='same',
                                               kernel_initializer='he_normal')
        self.conv1d_2 = tf.keras.layers.Conv1D(65, 7, activation='relu', padding='same', kernel_initializer='he_normal')

        self.maxPool1d = tf.keras.layers.MaxPooling1D(2)
        self.norm = tf.keras.layers.BatchNormalization()

        self.flatten = tf.keras.layers.GlobalMaxPooling1D()

        self.dense1 = tf.keras.layers.Dense(100, activation="relu")

        self.dense2 = tf.keras.layers.Dense(1, activation='sigmoid')

        self.dropout = tf.keras.layers.Dropout(0.3)

    def initModel(self):
        self._initLayers()

        inpt = self.embedding(self.inp)

        embed = self.spatialDrop(inpt)

        embed = self.conv1d_1(embed)

        embed = self.conv1d_2(embed)

        embed = self.maxPool1d(embed)

        embed = self.norm(embed)

        flatten = self.flatten(embed)

        embed = self.dropout(self.dense1(flatten))

        outp = self.dense2(embed)

        model = tf.keras.Model(inputs=self.inp, outputs=outp)

        return model
