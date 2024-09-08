import csv
import io
from flask import Flask, jsonify
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
from googleapiclient.discovery import build
from textblob import TextBlob
from datetime import datetime, timedelta
########
from flask_cors import CORS
from collections import defaultdict
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
sid = SentimentIntensityAnalyzer()


app = Flask(__name__)
CORS(app)


API_KEY = 'AIzaSyBgItAbyzmPJ5I-nCc-TW2tSElb3cl5TUM'
youtube = build('youtube', 'v3', developerKey=API_KEY)



def get_top_videos_with_keyword(keyword):
    # Fetch videos based on keyword in title or thumbnail and sort by view count
    date_published = (datetime.now() - timedelta(days=180)).strftime('%Y-%m-%dT%H:%M:%SZ')
    request = youtube.search().list(
        q=keyword,
        part='snippet',
        type='video',
        order='viewCount',
        # publishedAfter=date_published,
        maxResults=5
    )
    response = request.execute()
    video_ids = [item['id']['videoId'] for item in response['items']]
    return video_ids

# Function to fetch comments for a given video ID
def fetch_youtube_comments(video_id):
    comments = []
    timestamps = []
    try:
        comments = []
        timestamps = []

        request = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id,
            maxResults=100,  # Maximum comments to retrieve
            textFormat='plainText'
        )
        response = request.execute()

        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            comments.append(comment)
            timestamp = item['snippet']['topLevelComment']['snippet']['publishedAt']
            timestamps.append(datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ"))

        return comments, timestamps
    except Exception as e:
        print(f"Exception occurred while fetching comments: {str(e)}")
        return [],[]# Return empty list if comments cannot be fetched

# Sentiment analysis function using TextBlob
def perform_sentiment_analysis(comments):
    positive_count = 0
    negative_count = 0
    neutral_count = 0
    subjectivity=0
    polarity1=0
    for comment in comments:
        analysis = TextBlob(comment)
        polarity = analysis.sentiment.polarity
        polarity1+=polarity
        subjectivity+=analysis.sentiment.subjectivity
        if polarity > 0:
            positive_count += 1
        elif polarity < 0:
            negative_count += 1
        else:
            neutral_count += 1

    total_comments = len(comments)
    if total_comments > 0:
        positive_percentage = (positive_count / total_comments) * 100
        negative_percentage = (negative_count / total_comments) * 100
        neutral_percentage = (neutral_count / total_comments) * 100
        sub=(subjectivity/(total_comments))
        pol=(polarity1/(total_comments))
    else:
        positive_percentage = 0
        negative_percentage = 0
        neutral_percentage = 0
        sub=0
        pol=0
    return {
        'positive': round(positive_percentage, 2),
        'negative': round(negative_percentage, 2),
        'neutral': round(neutral_percentage, 2),
        'subjectivity':round(sub,2),
        'polarity':round(pol,2)
    }

def get_video_likes(video_id):
    video_response = youtube.videos().list(
        part='statistics',
        id=video_id
    ).execute()

    if 'items' in video_response and video_response['items']:
        statistics = video_response['items'][0]['statistics']
        like_count = int(statistics.get('likeCount', 0))
        return like_count

    return 0

def get_video_count(video_id):
    request = youtube.videos().list(
        part='statistics',
        id=video_id
    )
    response = request.execute()

    # Extract view count from the response
    view_count = response['items'][0]['statistics']['viewCount']
    return int(view_count)

def analyze_sentiment(comments):
    sentiment_scores = []

    for comment in comments:
        analysis = TextBlob(comment)
        sentiment_scores.append(analysis.sentiment.polarity)

    return sentiment_scores

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/result', methods=['GET', 'POST'])
def sentiment_analysis():
    channel_sentiments = {}
    total_channel_sentiment = {'positive': 0, 'negative': 0, 'neutral': 0,'polarity':0,'subjectivity':0,'score':0}
    total_videos_with_comments = 0
    likes=0
    views=0
    if request.method == 'POST':
        data= request.json
        keyword=data.get('keyword')
        video_ids = get_top_videos_with_keyword(keyword)
        for video_id in video_ids:
            comments,timestamps = fetch_youtube_comments(video_id)
            print(video_id)
            if comments:
                sentiment = perform_sentiment_analysis(comments)
                comment=' '.join(comments)
                scores = sid.polarity_scores(comment)
                total_channel_sentiment['positive'] += sentiment['positive']
                total_channel_sentiment['negative'] += sentiment['negative']
                total_channel_sentiment['neutral'] += sentiment['neutral']
                total_channel_sentiment['polarity'] += sentiment['polarity']
                total_channel_sentiment['subjectivity'] += sentiment['subjectivity']
                total_channel_sentiment['score'] +=scores['compound']    
                total_videos_with_comments += 1
            likes=get_video_likes(video_id)
            views=get_video_count(video_id)
            daily_sentiment = defaultdict(list)
        sentiment_scores = analyze_sentiment(comments)
        for i, timestamp in enumerate(timestamps):
            day = timestamp.date()
            daily_sentiment[day].append(sentiment_scores[i])

        # Calculate average sentiment for each day
        daily_avg_sentiment = {day: sum(scores) / len(scores) for day, scores in daily_sentiment.items()}


    avg_sentiment = {
        'positive': total_channel_sentiment['positive'] / total_videos_with_comments if total_videos_with_comments else 0,
        'negative': total_channel_sentiment['negative'] / total_videos_with_comments if total_videos_with_comments else 0,
        'neutral': total_channel_sentiment['neutral'] / total_videos_with_comments if total_videos_with_comments else 0,
        'polarity': total_channel_sentiment['polarity'] / total_videos_with_comments if total_videos_with_comments else 0,
        'subjectivity': total_channel_sentiment['subjectivity'] / total_videos_with_comments if total_videos_with_comments else 0,
        'score': total_channel_sentiment['score'] / total_videos_with_comments if total_videos_with_comments else 0
    }
    print(avg_sentiment['negative'])
    
    data = {
        'channel': avg_sentiment,
        'like': likes,
        'view': views
    }
    print(data)
    # return data
    return jsonify({ "Result" : data['channel'], "like" : data['like'], "view" : data['view']})


def fetch_you_comments(video_id):
    try:
        request_comments = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id,
            maxResults=100  # Adjust the number of comments to fetch
        )
        response_comments = request_comments.execute()
        comments = [item['snippet']['topLevelComment']['snippet']['textDisplay'] for item in response_comments['items']]
        return comments
    except Exception as e:
        print(f"Exception occurred while fetching comments: {str(e)}")
        return []  # Return empty list if comments cannot be fetched

@app.route('/you', methods=['GET', 'POST'])
def index():
    best_channels = []
    if request.method == 'POST':
        data=request.json
        # product_name = request.form['product_name'].lower()  # Convert input to lowercase
        product_name = data.get('product_name').lower()
        print(product_name)
        if product_name:
            # Fetch channel IDs for the entered product-related channels
            channel_names = []
            if product_name == "laptop":
                 channel_names = ["DELL", "HP", "ASUS","Lenovo","Acer","Apple","Microsoft Surface"]  # Add channel names for respective laptop brands
            elif product_name == "mobile":
                channel_names = ["Samsung", "Redmi India", "vivo - India","Xiaomi India","Apple","Oppo","OnePlus"]
            elif product_name == "watch":
                channel_names = ["ROLEX","Titan","Fastrack","Sonata","Michael kors","Calvin Klein","Fossil"]
            elif product_name == "clothing":
                channel_names = ["Adidas","Allen Solly","Fabindia","Biba","H&M","Levi's","Louis Philippe","Peter England","Zara"]
            elif product_name == "shoes":
                channel_names = ["Puma","Nike","Reebok","Bata","Red Tape","Lancer","Woodland","Adidas","Hitz"]
            channel_sentiments = {}
            
            for channel_name in channel_names:
                video_ids = get_top_videos_with_keyword(channel_name+" "+product_name)
                for channel_id in video_ids:                        
                        # Analyze comments for each video
                        total_channel_sentiment = {'positive': 0, 'negative': 0, 'neutral': 0,'polarity':0,'subjectivity':0,'score':0}
                        total_videos_with_comments = 0
                     # Check if comments are enabled for the video
                        comments = fetch_you_comments(channel_id)
                        if comments:
                            sentiment = perform_sentiment_analysis(comments)
                            comment=' '.join(comments)
                            scores = sid.polarity_scores(comment)
                            total_channel_sentiment['positive'] += sentiment['positive']
                            total_channel_sentiment['negative'] += sentiment['negative']
                            total_channel_sentiment['neutral'] += sentiment['neutral']
                            total_channel_sentiment['polarity'] += sentiment['polarity']
                            total_channel_sentiment['subjectivity'] += sentiment['subjectivity']
                            total_channel_sentiment['score'] +=scores['compound']
                            total_videos_with_comments += 1
                        else:
                            print(f"Comments could not be fetched for video ID: {channel_id}")
                
                # Calculate average sentiment for the channel
                avg_sentiment = {
                    'positive': total_channel_sentiment['positive'] / total_videos_with_comments if total_videos_with_comments else 0,
                    'negative': total_channel_sentiment['negative'] / total_videos_with_comments if total_videos_with_comments else 0,
                    'neutral': total_channel_sentiment['neutral'] / total_videos_with_comments if total_videos_with_comments else 0,
                    'polarity': total_channel_sentiment['polarity'] / total_videos_with_comments if total_videos_with_comments else 0,
                    'subjectivity': total_channel_sentiment['subjectivity'] / total_videos_with_comments if total_videos_with_comments else 0,
                    'score': total_channel_sentiment['score'] / total_videos_with_comments if total_videos_with_comments else 0
                }
                channel_sentiments[channel_name] = avg_sentiment
                print(channel_sentiments[channel_name])
            # Sort channels by positive sentiment percentage
            sorted_channels = sorted(channel_sentiments.items(), key=lambda x: x[1]['positive'], reverse=True)[:3]
            best_channels = [{'channel': channel[0], 'sentiment': channel[1]} for channel in sorted_channels]

   
    print(best_channels)
    return jsonify({"Results":best_channels})


if __name__ == '__main__':
    app.run(debug=True)