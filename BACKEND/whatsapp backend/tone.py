import openai

from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

def transcribe_audio(mp3_file_path, api_key):
    # Initialize the OpenAI client with your API key
    openai.api_key = api_key

    # Transcribe the audio using Whisper API
    with open(mp3_file_path, "rb") as audio_file:
        whisper_response = openai.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1"
        )
    return whisper_response.text

def analyze_sentiment(text):
    # Analyze sentiment using GPT-3.5-turbo model
    prompt = f"This is the sentiment analysis of the transcribed audio: '{text}'. The emotion of this text is:,The emotions can be anything like happy joy sad threat angry,surprise"
    sentiment_analysis = openai.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
         max_tokens=50,
       
    )

    # Extracting sentiment from the generated response
    return sentiment_analysis.choices[0].text
    

@app.route('/get_chatgpt_response', methods=['POST'])
def transcribe_and_analyze_sentiment(mp3_file_path, api_key):
    # Transcribe audio
    whisper_response = transcribe_audio(mp3_file_path, api_key)

    # Analyze sentiment
    sentiment = analyze_sentiment(whisper_response)

    return whisper_response, sentiment

api_key = "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"
mp3_file_path = "./input/Actor_03/03-01-08-02-02-02-06.wav"
transcription, sentiment = transcribe_and_analyze_sentiment(mp3_file_path, api_key)

print(f"Transcription: {transcription}")
print(f"Sentiment: {sentiment}")