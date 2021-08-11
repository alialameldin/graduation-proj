from pydub import AudioSegment
from pydub.silence import split_on_silence
from scipy.io.wavfile import read
import numpy as np
import moviepy.editor as mp
from moviepy.editor import VideoFileClip
import io
from google.cloud import speech
from google.oauth2 import service_account
import time
import os
from shutil import rmtree

def get_silence_threshold(data, confidence= 0.9995):
    best_match = 0
    for i in range(100, 0, -1):
        if len(np.where(np.logical_and(data>= -i, data<= i))[0]) / len(data) < confidence:
            best_match = i+1
            break
    return best_match

def zero_runs(a):
    # Create an array that is 1 where a is 0, and pad each end with an extra 0.
    iszero = np.concatenate(([0], np.less_equal(a, get_silence_threshold(a)).view(np.int8), [0]))
    absdiff = np.abs(np.diff(iszero))
    # Runs start and end where absdiff is 1.
    ranges = np.where(absdiff == 1)[0].reshape(-1, 2)
    return ranges

def video_to_audio(path,dst):
    clip = mp.VideoFileClip(path)
    clip.audio.write_audiofile(dst)

def Generate_transcriptions(utt,config,client):
    with io.open(utt, "rb") as audio_file:
        content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)
    response = client.recognize(config=config, audio=audio)
    print(response)
    return response.results

def split_video(original_video,start,end,output_name):
    clip = VideoFileClip(original_video).subclip(start,end)
    clip.write_videofile(output_name)

def split_to_utts(video, data_path):
    language = 'en-US'
    video_path = os.path.join(data_path, 'Video')
    audio_path = os.path.join(data_path, 'Audio')
    text_path = os.path.join(data_path, 'Text')
    fullAudioPath= os.path.abspath(os.path.join(data_path, 'FullAudio.wav'))
    video_to_audio(video, fullAudioPath)
    # read audio samples
    #calculating the mean silence time
    input_data = read(fullAudioPath)
    audio = input_data[1]
    audio = audio[:, 0] / (audio[:, 0].max()) * 100
    silence_periods = zero_runs(audio)
    silence_time = silence_periods[:, 1] - silence_periods[:, 0]
    threshold=np.mean(silence_time)
    """
    Splitting the large audio file into chunks
    """
    # open the audio file using pydub
    sound = AudioSegment.from_wav(fullAudioPath)
    # split audio sound where silence is 700 miliseconds or more and get chunks
    print('Silence time: ', np.int32(np.ceil((threshold / sound.frame_rate) * 1000)))
    chunks = split_on_silence(sound,
        # experiment with this value for your target audio file
        min_silence_len = np.int32(np.ceil((threshold/sound.frame_rate)*1000)),
        # adjust this per requirement
        silence_thresh = sound.dBFS-16,
        # keep the silence for 1 second, adjustable as well
        keep_silence=2000
    )
    os.remove(fullAudioPath)
    vid_without_path=video.split(sep='/')[-1]
    video_name = vid_without_path.split(sep=".")[0]
    # extension=splitted_name[1]
    #creating a client to use google_speechToText API
    credentials = service_account.Credentials.from_service_account_file(
        os.path.abspath(os.path.join(os.getcwd(), 'Config', 'dataset-creator-credentials.json')))
    client = speech.SpeechClient(credentials=credentials)
    #fixed configurations for audio files
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=sound.frame_rate,
        language_code=language,
        audio_channel_count=2
    )
    # create a directory to store the audio chunks
    if not os.path.isdir(video_path):
        os.mkdir(video_path)
    else:
        rmtree(video_path)
        os.mkdir(video_path)
        
    if not os.path.isdir(audio_path):
        os.mkdir(audio_path)
    else:
        rmtree(audio_path)
        os.mkdir(audio_path)
        
    if not os.path.isdir(text_path):
        os.mkdir(text_path)
    else:
        rmtree(text_path)
        os.mkdir(text_path)
    # process each chunk
    print('num of chunks: ', len(chunks))
    skip=0
    for i, audio_chunk in enumerate(chunks, start=1):
        # export audio chunk and save it in
        # the `folder_name` directory.
        chunk_filename = os.path.join(audio_path, f"{video_name}_{i-skip}.wav")
        if os.path.exists(chunk_filename) and os.path.exists(os.path.join(video_path,f"{video_name}_{i-skip}.mp4")) and os.path.exists(os.path.join(text_path, f"{video_name}_{i-skip}.txt")) :
            skip=skip+1
            print('Utterance already exists')
            time.sleep(0.3)
            continue
        audio_chunk[0].export(chunk_filename, format="wav")
        start=round(audio_chunk[1]/1000,3)
        end=round(audio_chunk[2]/1000,3)
        split_video(video,start,end,os.path.join(video_path,f"{video_name}_{i-skip}.mp4"))
        try:
            results = Generate_transcriptions(chunk_filename, config, client)
            with open(os.path.join(text_path, f"{video_name}_{i-skip}.txt"), "w") as file:
                for result in results:
                    file.write(result.alternatives[0].transcript + "\n")
        except:
            os.remove(os.path.join(audio_path, f"{video_name}_{i-skip}.wav"))
            os.remove(os.path.join(video_path, f"{video_name}_{i-skip}.mp4"))
            skip=skip+1
    print('/'.join(video.split('/')[-2:])+' is done')
    # os.remove(video)
    return 1

