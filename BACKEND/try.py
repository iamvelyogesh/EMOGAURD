import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Endpoint to fetch comments from a specific user's profile
@app.route('/fetch_comments', methods=['POST'])
def fetch_comments():
    try:
        # Extract data from the request sent by the frontend
        data = request.json
        user_id = data.get('userId')
        
        # Make a GET request to the Apify API endpoint
        response = requests.get(f'https://api.apify.com/v2/users/{user_id}/parameters')
        
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract comments from the API response
            comments = response.json().get('data', {}).get('profile', {}).get('comments', [])
            return jsonify(comments)
        else:
            return jsonify({"error": "Failed to fetch comments"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
