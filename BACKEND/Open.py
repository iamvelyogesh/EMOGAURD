# from flask import Flask, request, jsonify
# import openai
# from flask_cors import CORS
# import re
# import json
# app = Flask(__name__)
# CORS(app)
# # Set your OpenAI API key
# openai.api_key = "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"  # Replace with your actual API key

# def get_chatgpt_response(user_input):
#     # Incorporate user input into the prompt
#     prompt = f"What is the sentiment of the sentence '{user_input}' and what is the emotion?"

#     # Make a request to the OpenAI API
#     response = openai.chat.completions.create(
#         engine="gpt-3.5-turbo-instruct",  # Use the ChatGPT engine
#         messages=prompt,
#         max_tokens=100  # Adjust as needed
#     )
#     return response.choices[0].messages.content()

# @app.route('/get_chatgpt_response', methods=['POST'])
# def get_response():
#     try:
#         # Get user input from the front end
#         user_input = request.json['text']

#         # Get ChatGPT response
#         chatgpt_response = get_chatgpt_response(user_input)
#         # parsed_data = json.loads(chatgpt_response)

# # Extract negative state and emotion using regular expressions
#         # match = re.search(r'is\s+(\w+),\s+and\s+the\s+emotion\s+is\s+(\w+)', parsed_data['chat'])
#         match = re.search(r'is\s+(\w+),\s+and\s+the\s+emotion\s+is\s+(\w+)', chatgpt_response)

#         if match:
#             negative_state = match.group(1)
#             emotion = match.group(2)

#             print("Negative State:", negative_state)
#             print("Emotion:", emotion)
#             return jsonify({'chat': chatgpt_response, 'Sentiment': negative_state, 'emotion': emotion})

#         else:
#             print("Pattern not found in the input.")

#         # Return the response as JSON
#         return jsonify({'chat': chatgpt_response})

#     except Exception as e:
#         return jsonify({'error': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)




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

def get_chatgpt_response(user_input):
    # Incorporate user input into the prompt
    prompt = f"What is the sentiment of the sentence '{user_input}' and what is the emotion?"

    # Make a request to the OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-instruct",  # Use the ChatGPT engine
        messages=prompt,
        max_tokens=100  # Adjust as needed
    )
    return response.choices[0].message['content']

@app.route('/get_chatgpt_response', methods=['POST'])
def get_response():
    try:
        # Get user input from the front end
        if 'audio' in request.files:
            audio_file = request.files['audio']
            audio_data = audio_file.read()

            # Process audio data (You need to implement this part based on your audio processing requirements)

            # For demonstration, we'll convert audio data to base64 string
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            user_input = f"Received audio file with data: {audio_base64}"
        else:
            user_input = request.json['text']

        # Get ChatGPT response
        chatgpt_response = get_chatgpt_response(user_input)

        # Perform sentiment analysis on the provided text
        sentiment = analyze_sentiment(user_input)

        # Extract negative state and emotion using regular expressions
        match = re.search(r'is\s+(\w+),\s+and\s+the\s+emotion\s+is\s+(\w+)', chatgpt_response)

        if match:
            negative_state = match.group(1)
            emotion = match.group(2)

            print("Negative State:", negative_state)
            print("Emotion:", emotion)
            return jsonify({'chat': chatgpt_response, 'sentiment': sentiment, 'emotion': emotion})

        else:
            print("Pattern not found in the input.")

        # Return the response as JSON
        return jsonify({'chat': chatgpt_response, 'sentiment': sentiment})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
