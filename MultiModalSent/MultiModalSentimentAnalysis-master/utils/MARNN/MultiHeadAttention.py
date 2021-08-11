import tensorflow as tf

class MultiHeadAttention(tf.keras.layers.Layer):
    def __init__(self, d, d_dash, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_dash = d_dash
        self.d = d
      
        self.dense_1 = tf.keras.layers.Dense(self.d_dash, activation= 'tanh')
        self.dense_2 = tf.keras.layers.Dense(1, activation= 'softmax')


    def call(self, D):
        
        D_transposed = tf.transpose(D, perm= [0, 1, 3, 2])
        
        a1 = self.dense_1(D_transposed)
        
        a1_updated = a1 / tf.sqrt(tf.cast(self.d, tf.float32))
        
        a2 = self.dense_2(a1_updated)
        
        A_d = tf.matmul(D, a2)
        
        # batch_size = tf.shape(q)[0]
      
        # q = self.wq(q)  # (batch_size, seq_len, d_model)
        # k = self.wk(k)  # (batch_size, seq_len, d_model)
        # v = self.wv(v)  # (batch_size, seq_len, d_model)
        # print(k.shape)
      
        # # q = self.split_heads(q, batch_size)  # (batch_size, num_heads, seq_len_q, depth)
        # # k = self.split_heads(k, batch_size)  # (batch_size, num_heads, seq_len_k, depth)
        # # v = self.split_heads(v, batch_size)  # (batch_size, num_heads, seq_len_v, depth)
        
        # print(k.shape)
        
        # # scaled_attention.shape == (batch_size, num_heads, seq_len_q, depth)
        # # attention_weights.shape == (batch_size, num_heads, seq_len_q, seq_len_k)
        # scaled_attention, attention_weights = scaled_dot_product_attention(
        #     q, k, v, mask)
      
        # scaled_attention = tf.transpose(scaled_attention, perm=[0, 2, 1, 3])  # (batch_size, seq_len_q, num_heads, depth)
      
        # concat_attention = tf.reshape(scaled_attention, 
        #                               (batch_size, -1, self.d_model))  # (batch_size, seq_len_q, d_model)
      
        # output = self.dense(concat_attention)  # (batch_size, seq_len_q, d_model)
      
        return A_d