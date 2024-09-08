from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import re
import base64

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "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"  # Replace with your actual API key

def analyze_sentiment(text):
    # Analyze sentiment using GPT-3.5-turbo model
    prompt = f"This is the sentiment analysis of the provided text: '{text}'. The emotions can be anything like happy, joy, sad, threat, angry, surprise."
    sentiment_analysis = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-instruct",
        messages=prompt,
        max_tokens=50
    )

    # Extracting sentiment from the generated response
    return sentiment_analysis.choices[0].text

@app.route('/get_chatgpt_response', methods=['POST'])
def get_chatgpt_response():
    audio_file = request.files['myfile']
    # Save the file if needed, then pass its path to transcribe_and_analyze_sentiment
    # For example, saving the file with a unique name
    audio_file_path = "input/"  # Adjust path as needed
    audio_file.save(audio_file_path)
    api_key = "your_openai_api_key"
    transcription = transcribe_audio(audio_file, api_key)
    result = analyze_sentiment(transcription)
    return jsonify({'result': result,})

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
if __name__ == '__main__':
    app.run(debug=True)
