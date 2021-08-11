import os
from pydub import AudioSegment
import cv2
from natsort import natsorted
from .IBM_Watson import watson_batch_stt

current_path = os.path.dirname(os.path.abspath(__file__))

# path for final data
def checkdirectoryexists(model_id):
    
    Newfinalvideo = os.path.join(current_path, "data_" + model_id, "video")
    Newfinalaudio = os.path.join(current_path, "data_" + model_id, "audio")
    Newfinaltranscript= os.path.join(current_path, "data_" + model_id, "text")
    
    if not os.path.exists(Newfinaltranscript) :    
        os.makedirs(Newfinaltranscript)
        
    if not os.path.exists(Newfinalvideo): 
        os.makedirs(Newfinalvideo)
    
    if not os.path.exists(Newfinalaudio) :    
        os.makedirs(Newfinalaudio) 
             
    return Newfinaltranscript,Newfinalaudio,Newfinalvideo
        

def PreprocessData(audiopath, videoPath, model_id):

    Newfinaltranscript,Newfinalaudio,Newfinalvideo= checkdirectoryexists(model_id)   
    
    for file in natsorted(os.listdir(audiopath)):
        
        file_noext = os.path.splitext(file)[0]
        
        #audio to text
        SpeechToTextResults = watson_batch_stt(os.path.join(audiopath, file_noext + ".wav")   ,'en-US','UTF-8')     
        # writting each word with its starting and ending time
        counter = 0
        counterj = 0
        f = open(os.path.join(Newfinaltranscript, file_noext+".txt"), "w")
        
        for j in SpeechToTextResults['results']:
            for i in SpeechToTextResults['results'][counterj]['alternatives'][0]['timestamps']:
                f.writelines(str(SpeechToTextResults['results'][counterj]['alternatives'][0]['timestamps'][counter][0]) + str(' ')+str(SpeechToTextResults['results'][counterj]['alternatives'][0]['timestamps'][counter][1]) +str(' ') + str(SpeechToTextResults['results'][counterj]['alternatives'][0]['timestamps'][counter][2])+str('\n'))
                counter+=1
            counterj+=1
            counter=0
        f.close()   
        
        # exracting starting and ending time for each word
       
        starting = []
        ending = []
        
        f = open(os.path.join(Newfinaltranscript, file_noext+".txt"), "r")
        
        for line in f:
            stripped_line = line.strip()
            splittedarray =stripped_line.split(' ')
            starting.append(splittedarray[1])
            ending.append(splittedarray[2])
        cap = cv2.VideoCapture(os.path.join(videoPath, file_noext+".mp4"))
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  #total number of frames
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        fourcc = int(cv2.VideoWriter_fourcc(*'mp4v')) # XVID codecs  
            
        # splitting video,audio(utterance zaman) into frames(new videos)
        idx = 0
        for  (begFidx),(endFidx) in zip(starting,ending):
            
            startTime = float(begFidx)*1000
            endTime = float(endFidx)*1000   
            uttrance = AudioSegment.from_wav( os.path.join(audiopath, file_noext+'.wav' ))
            extract = uttrance[startTime:endTime]
            extract.export( os.path.join(Newfinalaudio, file_noext+'_'+str(idx+1)+'.wav'), format="wav")
        
        
            writer = cv2.VideoWriter(os.path.join(Newfinalvideo, file_noext+'_'+str(idx+1)+'.mp4'), fourcc,fps,size)       
            cap.set(cv2.CAP_PROP_POS_FRAMES,int(float(begFidx)*fps))
            ret = True # has frame returned
            while(cap.isOpened() and ret and cap.isOpened()):
                
                ret, frame = cap.read()
                frame_number = cap.get(cv2.CAP_PROP_POS_FRAMES) - 1
                if frame_number < int(float(endFidx)*fps):
                    # print('ent')
                    writer.write(frame)
                elif frame_number == int(float(endFidx)*fps):
                    writer.write(frame)
                    break
                else:
                    break
            
            idx+=1  
            writer.release()       
            
            
        f.close() 
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_" + model_id + "/")





    
    
    
    
    
    
    
    
    
    
    
 
