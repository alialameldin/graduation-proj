import tensorflow as tf
from tensorflow.keras.layers import Layer

class CustomDense(Layer):
    '''
    Build custom layer mimicks the Dense Layer
    '''
    def __init__(self,units=128,initializer='glorot_uniform',activation=None,name=None,**kwargs):
        '''
        Constructor of the class
        args:
            units: {int} number of neurons in the layer
            initializer: {string or callable instance of tf.keras.initializers } initial weights
            activation: {callable instance of tf.keras.activations} activation function to use
            name: name of the layer {string}. There is already a name param in Base Class
            kwargs: keyword arguments of the base Layer Class
        '''
        super(CustomDense,self).__init__(**kwargs) # constructor of Base Layer class
        self.units = units # number of neurons
        self.activation = activation # activation function
        self.initializer = initializer # initializer
        if name: # it works but but you SHOUD NOT USE IT
            self._name = name
        
    def build(self,input_shape):
        '''
        method typically used to create the weights of Layer subclasses. During forward pass or call() model
        will automatically call the build method to get the shape of the input tensor
        args:
            input_shape: a tensor describing shape of input. it'll be passed automatically as input.shape
        '''
        self.w = self.add_weight(shape=(input_shape[-1],self.units),initializer=self.initializer,trainable=True)
        # add_weight is a method of Layer base class. input_shape[-1] gives number of features
        
        self.b = self.add_weight(shape=(self.units,),initializer=self.initializer,trainable=True)
        # add bias and set to trainable. NOTE: never forget to add a , after self.units as
        # (1) == int(1) but (1,) = tuple([1])

        
    def call(self,input_tensor):
        '''
        method to implement the forward pass
        args:
            input: input tensor
        '''
        result = tf.matmul(input_tensor,self.w)+self.b 
        # apply the formula y = wx + b in matric multiplication form
        
        if self.activation:
            result = self.activation(result) # apply activation function
            
        return result