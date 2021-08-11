import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

def create_waveform(file_path, sr=16000):
    signal, sr = librosa.load(file_path, sr= sr)
    return signal, sr

def plot_waveform(signal, sr):
    librosa.display.waveplot(signal, sr= sr)
    plt.title('Waveform')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.show()  

def create_fft_spectrum(signal, sr, only_half= True):
    fft = np.fft.fft(signal)
    magnitude = np.abs(fft)    
    frequency = np.linspace(0, sr, len(magnitude))
    
    if only_half:    
        magnitude = magnitude[:int(len(frequency) / 2)]
        frequency = frequency[:int(len(frequency) / 2)]
    
    return frequency, magnitude

def plot_fft_spectrum(freq, mag):
    plt.plot(freq, mag)
    plt.title('FFT Spectrum')
    plt.xlabel('Frequency')
    plt.ylabel('Magnitude')
    plt.show()

def create_stft_spectrogram(signal, n_fft= 2048, hop_length= 512):    
    stft = librosa.core.stft(signal, hop_length= hop_length, n_fft= n_fft)  
    spectrogram = np.abs(stft)
    log_spectrogram = librosa.amplitude_to_db(spectrogram)
    return log_spectrogram

def plot_stft_spectrogram(spectrogram, sr=16000, hop_length= 512):
    librosa.display.specshow(spectrogram, sr= sr, hop_length= hop_length)
    plt.title('STFT Spectrogram (dB)')
    plt.xlabel('Time')
    plt.ylabel('Frequency')
    plt.colorbar()    
    plt.show()

def calculate_mfcc(signal, sr=16000, n_fft= 2048, hop_length= 512, n_mfcc= 13):
    MFCCs = librosa.feature.mfcc(signal, sr= sr, n_fft= n_fft,
                                  hop_length= hop_length, n_mfcc= n_mfcc)

    return MFCCs

def plot_mfcc(mfcc, sr=16000, hop_length= 512):
    librosa.display.specshow(mfcc, sr= sr, hop_length= hop_length)
    plt.title('MFCC Heatmap')
    plt.xlabel('Time')
    plt.ylabel('MFCC')
    plt.colorbar()    
    plt.show()


def preprocess_audio_file(file_path, sr= 16000, n_fft= 2048, hop_length= 512, n_mfcc= 13,
                          show_waveform= False, show_fft_spectrum= False,
                          show_stft_spectrogram = False, show_mfcc= False):
    # Creating Waveform
    signal, sr = create_waveform(file_path, sr= sr)
    
    # Plotting Waveform
    if show_waveform:
        plot_waveform(signal, sr)
    
    # Creating FFT Spectrum
    frequency, magnitude = create_fft_spectrum(signal, sr)
    
    # Plotting FFT Spectrum
    if show_fft_spectrum:
        plot_fft_spectrum(frequency, magnitude)
    
    # Creating STFT Spectrogram
    log_spectrogram = create_stft_spectrogram(signal, n_fft= n_fft, hop_length= hop_length)
    
    # Plotting FFT Spectrum
    if show_stft_spectrogram:
        plot_stft_spectrogram(log_spectrogram, sr= sr, hop_length= hop_length)
    
    # Calculating MFCCs
    MFCCs = calculate_mfcc(signal, sr= sr, n_fft= n_fft, hop_length= hop_length, n_mfcc= n_mfcc)
    
    # Plotting MFCCs
    if show_mfcc:
        plot_mfcc(MFCCs, sr= sr, hop_length= hop_length)
    
    return np.transpose(MFCCs)