from flask import Flask
from flask import render_template, redirect, request, send_from_directory
import csv

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

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def calculate_overall_sentiment(comments):
    total_comments = len(comments)

    positive_count = sum(1 for comment in comments if comment['sentiment'] == 'Positive')
    negative_count = sum(1 for comment in comments if comment['sentiment'] == 'Negative')
    neutral_count = sum(1 for comment in comments if comment['sentiment'] == 'Neutral')

    positive_percentage = (positive_count / total_comments) * 100 if total_comments > 0 else 0
    negative_percentage = (negative_count / total_comments) * 100 if total_comments > 0 else 0
    neutral_percentage = (neutral_count / total_comments) * 100 if total_comments > 0 else 0

    overall_sentiment = {
        'positive': positive_percentage,
        'negative': negative_percentage,
        'neutral': neutral_percentage,
    }

    return overall_sentiment

  

def get_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    compound_score = analyzer.polarity_scores(text)['compound']
    
    if compound_score >= 0.05:
        return 'Positive'
    elif compound_score <= -0.05:
        return 'Negative'
    else:
        return 'Neutral'

def parse(subreddit, post_count , comment_count,keywords,after=''):
    # Existing parse function code remains unchanged
    # Add a list to store the results
    post_params = f'&after={after}' if after else ''
    post_url_template = 'https://www.reddit.com/r/{}/top.json?t=all{}'

    headers = {
        'User-Agent': 'VirboxBot'
    }

    total_posts = 0  # Track the number of fetched posts
    total_comments = 0  # Track the number of fetched comments
    results = []
    

        
    while total_posts < post_count:
        # ... (rest of the existing parse function)
        url = post_url_template.format(subreddit, post_params)
        response = requests.get(url, headers=headers)

        if response.ok:
            data = response.json()['data']
            for post in data['children']:
                pdata = post['data']
                post_id = pdata['id']
                title = pdata['title']
                score = pdata['score']
                author = pdata['author']
                date = pdata['created_utc']
                url = pdata.get('url_overridden_by_dest')
                print(f"Post: {post_id}")

                    # Get comments for the current post
                comments_url = f'https://www.reddit.com/r/{subreddit}/comments/{post_id}.json'
                comments_response = requests.get(comments_url, headers=headers)

                if comments_response.ok:
                    comments_data = comments_response.json()
                    for comment in comments_data[1]['data']['children']:
                # ... (rest of the existing comment loop)
                        comment_data = comment['data']
                        if 'body' in comment_data:
                            comment_body = comment_data['body']
                            print(f"   Comment: {comment_body}")

                            if any(keyword in comment_body.lower() for keyword in keywords):
                # Perform sentiment analysis on the comment
                                sentiment = get_sentiment(comment_body)
                            

                                results.append({'comment': comment_body, 'sentiment': sentiment})
                                total_comments += 1
                                if total_comments >= comment_count:
                                    break  # Break out of the comment loop when reaching the desired count
                                else:
                                    print("   Comment does not have a 'body' key")

                    total_posts += 1
                    if total_posts >= post_count:
                        break # Break out of the post loop when reaching the desired count

                after = data['after']

                # Add result to the list

    return results

def write_to_csv(results, filename='comments.csv'):
    # Write the results to a CSV file
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ['comment', 'sentiment']
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        # Write the header
        writer.writeheader()

        # Write the data
        for result in results:
            writer.writerow(result)



@app.route('/fetch_data', methods=['POST'])
def fetch_data():
    data = request.json
    # subreddit = data.get('subreddit', 'ipl')  # Default to 'ipl' if subreddit is not provided
    subreddit = data.get('subreddit', 'ipl')  # Default to 'ipl' if subreddit is not provided
    post_count = data.get('post_count', 8)
    comment_count = data.get('comment_count', 7)
    # Call the parse function with the provided subreddit
    # results = parse(subreddit, post_count, comment_count)
    keywords_to_check = ['good', 'bad', 'fun','not','regular','update','super','wow','exicitng','useless','best','nice','wow','plesant','idiot']
    parsed_results = parse(subreddit, post_count, comment_count, keywords_to_check)
    write_to_csv(parsed_results, 'comments_filtered.csv')
    # write_to_csv(results)
    
    
    overall_sentiment = calculate_overall_sentiment(parsed_results)
    
    print(overall_sentiment)
    return {'results': parsed_results, 'overall_sentiment': overall_sentiment}
    
    # return {'results': parsed_results}

if __name__ == '__main__':
    app.run(debug=True)
    # app.run(host='127.0.0.2', port=8080)