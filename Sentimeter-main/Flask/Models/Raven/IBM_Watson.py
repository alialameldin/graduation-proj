WATSON_API_KEY = 'Yv0BqVl3wH_upd1VkMR_fuGNtozGR5lyZxlC7IpRq9Wd'
WATSON_STT_URL = 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/6b8f731c-e95c-4589-8ab3-fd4a2b85b05e'

## Implementing the Speech To Text module
import os
import json
import pandas as pd

from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

def watson_batch_stt(filename: str, lang: str, encoding: str) -> str:
    authenticator = IAMAuthenticator(WATSON_API_KEY)
    speech_to_text = SpeechToTextV1(authenticator=authenticator)
    speech_to_text.set_service_url(WATSON_STT_URL)

    with open(filename, 'rb') as audio_file:
        response = speech_to_text.recognize(
            audio=audio_file,
            content_type='audio/{}'.format(os.path.splitext(filename)[1][1:]),
            model=lang + '_NarrowbandModel',
            max_alternatives=0,
            speaker_labels=True,
            inactivity_timeout=-1,
        ).get_result()

    return response


