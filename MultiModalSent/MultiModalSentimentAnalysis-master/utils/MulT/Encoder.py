import tensorflow as tf
from .MHAttention import point_wise_feed_forward_network, MultiHeadAttention
from .PosE import positional_encoding

class EncoderLayer(tf.keras.layers.Layer):
  def __init__(self, d_model, num_heads, dff, rate=0.1, name= None, **kwargs):
      super(EncoderLayer, self).__init__(name= name, **kwargs)

      self.mha = MultiHeadAttention(d_model, num_heads)
      self.ffn = point_wise_feed_forward_network(d_model, dff)

      self.layernorm1 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
      self.layernorm2 = tf.keras.layers.LayerNormalization(epsilon=1e-6)

      self.dropout1 = tf.keras.layers.Dropout(rate)
      self.dropout2 = tf.keras.layers.Dropout(rate)

  def call(self, q, k, v, training, mask):

    attn_output, _ = self.mha(q, k, v, mask)  # (batch_size, input_seq_len, d_model)
    attn_output = self.dropout1(attn_output, training=training)
    out1 = self.layernorm1(q + attn_output)  # (batch_size, input_seq_len, d_model)

    ffn_output = self.ffn(out1)  # (batch_size, input_seq_len, d_model)
    ffn_output = self.dropout2(ffn_output, training=training)
    out2 = self.layernorm2(out1 + ffn_output)  # (batch_size, input_seq_len, d_model)

    return out2

class Encoder(tf.keras.layers.Layer):
    def __init__(self, num_layers, d_model, num_heads, dff, maximum_position_encoding, rate=0.1, name= None, **kwargs):
        super(Encoder, self).__init__(name= name, **kwargs)
        
        self.d_model = d_model
        self.num_layers = num_layers
        self.num_heads = num_heads
        self.dff = dff
        self.rate = rate
        self.maximum_position_encoding = maximum_position_encoding
      
        self.pos_encoding = positional_encoding(self.maximum_position_encoding, 
                                                self.d_model)
        
        self.enc_layers = []
        for _ in range(self.num_layers):            
            self.enc_layers.append(EncoderLayer(self.d_model, self.num_heads, self.dff, self.rate))
      
        self.dropout = tf.keras.layers.Dropout(self.rate)
    
    def call(self, q, k, v, training= True, mask= None):
    
        seq_len = q.shape[1]
        
        # adding embedding and position encoding.
        q *= tf.math.sqrt(tf.cast(self.d_model, tf.float32))
        q += self.pos_encoding[:, :seq_len, :]
        
        q = self.dropout(q, training=training)
        
        for i in range(self.num_layers):
          x = self.enc_layers[i](q, k, v, training, mask)
        
        return x  # (batch_size, input_seq_len, d_model)
    
    def get_config(self):
        config = {
            'num_layers': self.num_layers,
            'd_model': self.d_model,
            'num_heads': self.num_heads,
            'dff': self.dff,
            'maximum_position_encoding': self.maximum_position_encoding,
            'rate': self.rate
        }        
        base_config = super(Encoder, self).get_config()
        return dict(list(base_config.items()) + list(config.items()))
    
    @classmethod
    def from_config(cls, config):
        return cls(**config)