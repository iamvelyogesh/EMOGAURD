from flask import Flask
from flask import render_template, redirect, request, send_from_directory

from werkzeug.utils import secure_filename
import os

from hatedetector import hatedetectorfunc
from badwords import bad_words_highlight
from sentiment import sentimentfunc
from speechtotext import get_large_audio_transcription
from imagetotext import get_image_transcription
from audiofromvideo import saveaudiofromvideo
from emoDetectv1 import emotion
from tweetsanalysis import tweetAnalysis
########
import re
import nltk
import joblib
import requests
import numpy as np
# from bs4 import BeautifulSoup
import urllib.request as urllib
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud,STOPWORDS
from flask import Flask,render_template,request
import time
import os
from selenium import webdriver
from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('wordnet')


wnl = WordNetLemmatizer()
sia = SentimentIntensityAnalyzer()
stop_words = stopwords.words('english')


##########

UPLOAD_FOLDER_AUDIO = "UserAudio"
ALLOWED_EXTENSIONS_AUDIO = {'mp3', 'wav', 'ogg', 'flac', '3gp', '3g'}

UPLOAD_FOLDER_IMAGE = "UserImage"
ALLOWED_EXTENSIONS_IMAGE = {'jpg', 'jpeg', 'png', 'tiff'}

UPLOAD_FOLDER_VIDEO = "UserVideo"
ALLOWED_EXTENSIONS_VIDEO = {'mp4', 'mov', 'mkv', 'wmv'}

def allowed_file_audio(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_AUDIO

def allowed_file_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE

def allowed_file_video(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_VIDEO

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER_AUDIO'] = UPLOAD_FOLDER_AUDIO
app.config['UPLOAD_FOLDER_IMAGE'] = UPLOAD_FOLDER_IMAGE
app.config['UPLOAD_FOLDER_VIDEO'] = UPLOAD_FOLDER_VIDEO

def textAnalysisResult(text, type, emotionResult={}, file=""):
    result = bad_words_highlight(text)
    isHate = "Hate" if result['isBad'] else "No Hate"
    if isHate == "Hate":
        text = result['rtext']
    else:
        isHate = "Hate" if hatedetectorfunc(text) else "No Hate"
    senti = sentimentfunc(text)
    
    # Only return the text as JSON
    return {
        'text': text,
        'isHate': isHate,
        'sentiment': senti,
        'type': type,
        'emotionResult': emotionResult,
        'file': file,
    }

# @app.route("/text",methods=['POST'])
# def text_hate():
@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    try:
        # Get the input text from the request
        input_text = request.json.get('text', '')
        print(input_text)

        # Perform any analysis or processing here (you can replace this with your actual logic)
        # For now, simply return "Hello world"
        result_text = "Hello world"

        # Return the result
        # return jsonify({'result': result_text})
        # return textAnalysisResult(request.form['message'],"text")
        result = textAnalysisResult(input_text, "text")
        return result
        # return jsonify({'result': result})

    except Exception as e:
        # Handle exceptions
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500
    
    
    #Audio FIle readings


@app.route("/audiofile/<path:path>")
def static_dir1(path):
    return send_from_directory("UserAudio", path)

@app.route("/tweet", methods=['POST'])
def tweet_hate():
        data = request.json  # Assuming data is sent as JSON in the request body

        # Extract relevant information from the received JSON data
        word = data.get('word', '')
        count = int(data.get('count', 0))
        emotion = data.get('emotion', '')

        # Assuming tweetAnalysis is a function that returns a string
        results = tweetAnalysis(word, count)
        print("My result", results['result'])
        # print(results)
        # Return the results as plain text
        # return [f"Keyword: {word}", f"Emotion: {emotion}", f"Result: {results}"]
        return jsonify({ "Result" : results['result'], "Nof" : results['nof']})

@app.route("/audio", methods=['POST'])
def audio_hate():
    if 'myfile' not in request.files:
        return 'No file part'
    file = request.files['myfile']
    if file.filename == '':
        return 'No selected file'
        # return redirect(request.url)
    if file and allowed_file_audio(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER_AUDIO'], filename))
        text = get_large_audio_transcription(os.path.join("UserAudio", filename))
        result = textAnalysisResult(text, "audio", file=filename)
        print(result)
        # return 'file uploaded'
        return (result)
    # return redirect(request.url)

@app.route("/imagefile/<path:path>")
def static_dir2(path):
    return send_from_directory("UserImage", path)


@app.route("/image",methods=['POST'])
def image_hate_():
        # check if the post request has the file part
        # return request.files
        print(request.files)
        print(request.files['myfile'])
        if 'myfile' not in request.files:
            return 'no file part'
        print(request.files['myfile'])
        file = request.files['myfile']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return 'no file selected'
        if file and allowed_file_image(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER_IMAGE, filename))
            
            text = get_image_transcription(filename).strip()

            emotionResult = emotion(filename)

            if text == "":
                # return render_template("result.html",file=filename,hastext=False,emotionResult=emotionResult,type="image")
                result = {
                    'text': text,
                    'type': type,
                    'hastext': False,
                    'emotionResult': emotionResult,
                    'file': file,
                }
                print (result)
                return result
            
            return textAnalysisResult(text,"image",file=filename,emotionResult=emotionResult)

        # return redirect(request.url)

@app.route("/images", methods=['POST'])
def image_hate():
    print(request.files)
    print(request.files['myfile'])

    if 'myfile' not in request.files:
        return 'no file part'

    file = request.files['myfile']

    if file.filename == '':
        return 'no file selected'

    if file and allowed_file_image(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER_IMAGE, filename))

        text = get_image_transcription(filename).strip()
        emotion_result = emotion(filename)

        if text == "":
            result = {
                'text': text,
                'hastext': False,
                'emotionResult': emotion_result,
            }
        else:
            result = textAnalysisResult(text, "image", filename, emotion_result)

        print(result)
        return jsonify(result)  # Use jsonify to handle JSON serialization



@app.route("/videofile/<path:path>")
def static_dir3(path):
    return send_from_directory("UserVideo", path)



@app.route("/video",methods=['POST'])
def video_hate():
        # check if the post request has the file part
        if 'myfile' not in request.files:
            return 'no file part'
        file = request.files['myfile']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return 'no file found'
        if file and allowed_file_video(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER_VIDEO, filename))

            saveaudiofromvideo(filename)

            text = get_large_audio_transcription("UserAudio/"+filename[:-3]+"mp3")

            if os.path.exists(os.path.join(UPLOAD_FOLDER_AUDIO, filename[:-3]+"mp3")):
                os.remove(os.path.join(UPLOAD_FOLDER_AUDIO, filename[:-3]+"mp3"))
            result = textAnalysisResult(text,"video",file=filename)
            
            return(result)
        # return redirect(request.url)



def returnsentiment(x):
    score =  sia.polarity_scores(x)['compound']
    
    if score>0:
        sent = 'Positive'
    elif score==0:
        sent = 'Negative'
    else:
        sent = 'Neutral'
    return score,sent

if __name__ == '__main__':
    app.run(debug=True)
