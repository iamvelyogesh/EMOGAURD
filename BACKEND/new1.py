from apify_client import ApifyClient
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import re
import json

from collections import Counter
app = Flask(__name__)
CORS(app)
# Set your OpenAI API key
openai.api_key = "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"  # Replace with your actual API key

def tweetcrawl(word):
    # Initialize the ApifyClient with your API token
    client = ApifyClient("apify_api_fFZUveH4I8TBH76qiHusPODBdgdCtn0y5KEy")
    count = 5
    run_input = {
        "queries": [word],
        "max_tweets": count,
        "language": "en",
        "use_experimental_scraper": False,
        "user_info": "user info and replying info",
        "max_attempts": 1,
    }

    # Run the Actor and wait for it to finish
    run = client.actor("wHMoznVs94gOcxcZl").call(run_input=run_input)
    emo=[]
    tweets = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        tweets.append(item['text'])
        user=f"Classify the sentence based on only these 6 emotions and give answer in single word(anger, surprise, disgust, happiness,fear,sadness) '{item['text']}'?"
        chatgpt_response=get_chatgpt_response(user)
        emo.append(chatgpt_response)
        
        
    # words=Counter(emo)
    # # word_array=[words[word] for word in emo]
    # happy=words['happy']
    # print(happy)
    # words = Counter(emo)

    # # Get the total count of each unique word
    # word_counts = {word: words[word] for word in words}

    # return word_counts
    
# def get_word_counts(emo):
#     # Count occurrences of each word in the array

    # Define the list of emotions
    emotions = ['anger', 'surprise', 'disgust', 'happiness', 'fear', 'sadness']

# Initialize a hashmap with values set to 0 for each emotion
    emotion_counts = {emotion: 0 for emotion in emotions}

# Example array of input words (replace with your actual array)
    input_words = ['Fear', 'Happiness', 'Fear', 'Surprise', 'Sadness', 'Fear', 'Anger', 'Fear']

# Lowercase the input words and update the hashmap
    for word in emo:
        lowercase_word = word.lower()
        if lowercase_word in emotion_counts:
            emotion_counts[lowercase_word] += 1

# Print the updated hashmap
    print(emotion_counts)
    return emotion_counts
    
    


def get_chatgpt_response(user_input):
    # Incorporate user input into the prompt
    prompt = f"What is the emotion of the sentence '{user_input}'?"

    # Make a request to the OpenAI API
    response = openai.Completion.create(
        engine="text-davinci-003",  # Use the ChatGPT engine
        prompt=prompt,
        max_tokens=100  # Adjust as needed
    )
    return response.choices[0].text.strip()

@app.route('/get_chatgpt_response', methods=['POST'])
def get_response():
    try:
        # Get user input from the front end
        user_input = request.json['text']

        # Get ChatGPT response
        chatgpt_response = get_chatgpt_response(user_input)
        # parsed_data = json.loads(chatgpt_response)
        twet=tweetcrawl(user_input)

        # Return the response as JSON
        return jsonify({'chat': chatgpt_response ,'tweet':twet})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)