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
from bs4 import BeautifulSoup
import urllib.request as urllib
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud,STOPWORDS
from flask import Flask,render_template,request
import time

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

def textAnalysisResult(text,type,emotionResult={},file=""):
    result = bad_words_highlight(text)
    isHate = "Hate" if result['isBad'] else "No Hate"
    if isHate == "Hate":
        text = result['rtext']
    else:
        isHate = "Hate" if hatedetectorfunc(text) else "No Hate"
    senti = sentimentfunc(text)
    if type == "image":
        print("succ")
        return render_template("result.html",file=file,hastext=True,text=text,isHate = isHate,sentiment=senti,type=type,emotionResult=emotionResult)
    else:
        return render_template("result.html",file=file,hastext=True,text=text,isHate = isHate,sentiment=senti,type=type)
    
####


###

app = Flask(__name__,static_url_path = "/static")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/audiofile/<path:path>")
def static_dir1(path):
    return send_from_directory("UserAudio", path)

@app.route("/imagefile/<path:path>")
def static_dir2(path):
    return send_from_directory("UserImage", path)

@app.route("/videofile/<path:path>")
def static_dir3(path):
    return send_from_directory("UserVideo", path)

@app.route("/")
def home_page():
    return render_template("index.html") 

@app.route("/home")
def home_re():
    return redirect("/")

@app.route("/text",methods=['GET'])
def text_page():
    return render_template("text.html")

@app.route("/text",methods=['POST'])
def text_hate():
    return textAnalysisResult(request.form['message'],"text")

@app.route("/tweet",methods=['GET'])
def tweet_page():
    return render_template("tweetanalysis.html")

@app.route("/tweet",methods=['POST'])
def tweet_hate():
    results = tweetAnalysis(request.form['word'],int(request.form['count']))
    return render_template("tweetanalysisResult.html",keyword = request.form['word'], emotion = request.form['emotion'],result=results)

@app.route("/image",methods=['GET'])
def image_page():
    return render_template("image.html")

@app.route("/image",methods=['POST'])
def image_hate():
        # check if the post request has the file part
        if 'myfile' not in request.files:
            return redirect(request.url)
        file = request.files['myfile']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file_image(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER_IMAGE, filename))
            
            text = get_image_transcription(filename).strip()

            emotionResult = emotion(filename)

            if text == "":
                return render_template("result.html",file=filename,hastext=False,emotionResult=emotionResult,type="image")

            return textAnalysisResult(text,"image",file=filename,emotionResult=emotionResult)

        return redirect(request.url)

@app.route("/audio",methods=['GET'])
def audio_page():
    return render_template("audio.html")

@app.route("/audio",methods=['POST'])
def audio_hate():
        # check if the post request has the file part
        if 'myfile' not in request.files:
            return redirect(request.url)
        file = request.files['myfile']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file_audio(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER_AUDIO, filename))
            
            text = get_large_audio_transcription("UserAudio/"+filename)

            return textAnalysisResult(text,"audio",file=filename)
        return redirect(request.url)


@app.route("/video",methods=['GET'])
def video_page():
    return render_template("video.html")

@app.route("/video",methods=['POST'])
def video_hate():
        # check if the post request has the file part
        if 'myfile' not in request.files:
            return redirect(request.url)
        file = request.files['myfile']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file_video(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER_VIDEO, filename))

            saveaudiofromvideo(filename)

            text = get_large_audio_transcription("UserAudio/"+filename[:-3]+"mp3")

            if os.path.exists(os.path.join(UPLOAD_FOLDER_AUDIO, filename[:-3]+"mp3")):
                os.remove(os.path.join(UPLOAD_FOLDER_AUDIO, filename[:-3]+"mp3"))

            return textAnalysisResult(text,"video",file=filename)
        return redirect(request.url)
####
def returnytcomments(url):
    data=[]

    chrome_driver_path = r"C:\Program Files\chromedriver\chromedriver-win64\chromedriver.exe"
    # driver = webdriver.Chrome(executable_path=chrome_driver_path)

    chrome_service = webdriver.chrome.service.Service(chrome_driver_path)
    driver = webdriver.Chrome(service=chrome_service)

    wait = WebDriverWait(driver,10)
    driver.get(url)

    for item in range(5): 
        wait.until(EC.visibility_of_element_located((By.TAG_NAME, "body"))).send_keys(Keys.END)
        time.sleep(2)

    for comment in wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#content"))):
        data.append(comment.text)

    return data

def clean(org_comments):
    y = []
    for x in org_comments:
        x = x.split()
        x = [i.lower().strip() for i in x]
        x = [i for i in x if i not in stop_words]
        x = [i for i in x if len(i)>2]
        x = [wnl.lemmatize(i) for i in x]
        y.append(' '.join(x))
    return y

# def create_wordcloud(clean_reviews):
#     # building our wordcloud and saving it
#     for_wc = ' '.join(clean_reviews)
#     wcstops = set(STOPWORDS)
#     wc = WordCloud(width=1400,height=800,stopwords=wcstops,background_color='white').generate(for_wc)
#     plt.figure(figsize=(20,10), facecolor='k', edgecolor='k')
#     plt.imshow(wc, interpolation='bicubic') 
#     plt.axis('off')
#     plt.tight_layout()
#     # CleanCache(directory='static\images')
#     plt.savefig('static\images\woc.png')
#     plt.close()
    
def returnsentiment(x):
    score =  sia.polarity_scores(x)['compound']
    
    if score>0:
        sent = 'Positive'
    elif score==0:
        sent = 'Negative'
    else:
        sent = 'Neutral'
    return score,sent


@app.route('/youtube')
def youtube():
    return render_template('youtubeAnalysis.html')

@app.route('/results',methods=['GET'])
def result():    
    url = request.args.get('url')
    
    org_comments = returnytcomments(url)
    temp = []

    for i in org_comments:
         if 5<len(i)<=500:
            temp.append(i)
    
    org_comments = temp

    clean_comments = clean(org_comments)

    # create_wordcloud(clean_comments)
    
    np,nn,nne = 0,0,0

    predictions = []
    scores = []

    for i in clean_comments:
        score,sent = returnsentiment(i)
        scores.append(score)
        if sent == 'Positive':
            predictions.append('POSITIVE')
            np+=1
        elif sent == 'Negative':
            predictions.append('NEGATIVE')
            nn+=1
        else:
            predictions.append('NEUTRAL')
            nne+=1

    dic = []

    for i,cc in enumerate(clean_comments):
        x={}
        x['sent'] = predictions[i]
        x['clean_comment'] = cc
        x['org_comment'] = org_comments[i]
        x['score'] = scores
        dic.append(x)

    return render_template('youtubeResult.html',n=len(clean_comments),nn=nn,np=np,nne=nne,dic=dic)

    
@app.route('/wc')
def wc():
    return render_template('wc.html')


class CleanCache:
	'''
	this class is responsible to clear any residual csv and image files
	present due to the past searches made.
	'''
	def __init__(self, directory=None):
		self.clean_path = directory
		# only proceed if directory is not empty
		if os.listdir(self.clean_path) != list():
			# iterate over the files and remove each file
			files = os.listdir(self.clean_path)
			for fileName in files:
				print(fileName)
				os.remove(os.path.join(self.clean_path,fileName))
		print("cleaned!")




if __name__ == "__main__":
        app.run(debug=True)