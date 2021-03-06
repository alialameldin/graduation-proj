import gensim
import numpy as np
import regex as re

np.random.seed(15)

class PreprocessData():
    def __init__(self, w2v_path,binary,no_header):
        # Word2vec Location of local Machine
        # '../../../../data/google.news.word2vec/GoogleNews-vectors-negative300.bin'
        self.word2vec = None
        print('Loading Word2vec')
        self.word2vec = gensim.models.KeyedVectors.load_word2vec_format(w2v_path, binary=binary,no_header=no_header)
        self.re_word_tokenizer = re.compile(r"\w+", re.I)
        self.reset()


    def set_maximum_sentence_length(self, sentences):
        sentences_tok = self.tokenize_sentences(sentences)
        self.max_sen_len = min(np.max([len(s) for s in sentences_tok]),512)

    def reset(self):
        self.dictionary = {}
        self.class2index = {}
        self.index2class = {}
        self.classCount = 0
        self.word2index = {'unk': 0}
        self.wordcount = {'unk': 0}
        self.index2word = {0: 'unk'}
        self.wordCount = 0
        self.wordCount_w2v = 0
        self.weights = None

    def tokenize_sentences(self, X):
        
        return [self.clean_str(sen).split(' ') for row in X for sen in row]

    def update_dict(self, sent):
        for word in sent:
            if not word.lower() in self.word2index:
                self.wordCount += 1
                self.word2index[word.lower()] = self.wordCount
                self.index2word[self.wordCount] = word.lower()
                self.wordcount[word.lower()] = 0
            self.wordcount[word.lower()] += 1

    def train_dictionary(self, sentences):
        sentences_tok = self.tokenize_sentences(sentences)
        for sent_tok in sentences_tok:
            self.update_dict(sent_tok)

        self.weights = np.zeros((self.wordCount + 1, self.word2vec.vector_size), np.float)
        for i in self.index2word:
            if self.index2word[i] in self.word2vec:
                self.weights[i, :] = self.word2vec[self.index2word[i]]
                self.wordCount_w2v += 1
            elif self.wordcount[self.index2word[i]] >= 5:
                self.weights[i, :] = np.random.uniform(-0.25, 0.25, self.word2vec.vector_size)
            else:
                pass
       


    def sent2Index(self, sentences):
        sentIndexed = []
        sentences_tok = self.tokenize_sentences(sentences)
        for sent_tok in sentences_tok:
            sentIndx = []
            for w in sent_tok:
                
                if len(sentIndx)==self.max_sen_len:
                    break
                    
                if w.lower() in self.word2index:
                    sentIndx.append(self.word2index[w.lower()])
                else:
                    sentIndx.append(self.word2index['unk'])

            if len(sentIndx) < self.max_sen_len:
             
                sentIndx = sentIndx + ([self.word2index['unk']] * (self.max_sen_len - len(sentIndx)))
            sentIndexed.append(sentIndx)

            ## As per paper we initially used variable sentence length
            ## adding 'unk' parameter only where it was necessary to achieve min filter
            ## length. While similar accuracy is achieved by the method it lacks speed.
            ## Missing out matrix multiplication as the modelling layer
            # if len(sentIndx) < 5:
            #     sentIndx = sentIndx + ([self.word2index['unk']] * (5 - len(sentIndx)))
            # sentIndexed.append(torch.LongTensor(sentIndx).to(device))

        return sentIndexed

    def clean_str(self, sent):
        
        sent = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", sent)
        sent = re.sub(r"\'s", " \'s", sent)
        sent = re.sub(r"\'ve", " \'ve", sent)
        sent = re.sub(r"n\'t", " n\'t", sent)
        sent = re.sub(r"\'re", " \'re", sent)
        sent = re.sub(r"\'d", " \'d", sent)
        sent = re.sub(r"\'ll", " \'ll", sent)
        sent = re.sub(r",", " , ", sent)
        sent = re.sub(r"!", " ! ", sent)
        sent = re.sub(r"\(", " ( ", sent)
        sent = re.sub(r"\)", " ) ", sent)
        sent = re.sub(r"\?", " ? ", sent)
        sent = re.sub(r"\s{2,}", " ", sent)
        sent = re.sub(r'^RT[\s]+', '', sent)
        sent = re.sub(r'https?:\/\/.*[\r\n]*', '', sent)
        sent = re.sub(r'#', '', sent)
        sent = re.sub(r'[0-9]', '', sent)
        
        return sent.strip().lower()

    def clean_str_sst(self, sent):
        sent = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", sent)
        sent = re.sub(r"\s{2,}", " ", sent)
        return sent.strip().lower()


    def proprocess_data(self, x):
        self.set_maximum_sentence_length(x)
        self.train_dictionary(x)
        x = self.sent2Index(x)
        
        return x