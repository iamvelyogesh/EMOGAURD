from flask import Flask, request
import requests
from flask_cors import  CORS 
from bs4 import BeautifulSoup
 
app = Flask(__name__)
CORS(app)
@app.route('/get_lyrics', methods=['POST'])
def get_lyrics():
#     import requests

# url = "https://www.azlyrics.com/lyrics/michaeljackson/billiejean.html"

# response = requests.get(url)
# soup = BeautifulSoup(response.content, 'html.parser')

# lyrics_div = soup.find('div', class_='ringtone')
# lyrics = lyrics_div.find_next_sibling('div').text.strip()

# print(lyrics)
    
    # song_name = request.form.get['song_name']
    try:
        
        data = request.get_json()
        song_name = data.get('song_name')
        artist_name = data.get('artist_name')

        print(song_name)
        print(artist_name)
        
        if song_name is None or artist_name is None:
            raise ValueError("Missing song_name or artist_name in the form data.")
        
        # Get lyrics from AzLyrics
        azlyrics_url = f'https://www.azlyrics.com/lyrics/{artist_name.lower()}/{song_name.lower()}.html'
        response = requests.get(azlyrics_url)
        
        soup = BeautifulSoup(response.content, 'html.parser')
        lyrics_div = soup.find('div', class_='ringtone')
        lyrics = lyrics_div.find_next_sibling('div').text.strip()
        
        # Extract lyrics from HTML (this may vary based on AzLyrics HTML structure)
        # start_tag = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->'
        # end_tag = '</div>'
        # lyrics_start = response.text.find(start_tag)
        # lyrics_end = response.text.find(end_tag, lyrics_start)
        # print(lyrics_end)

        # lyrics = response.text[lyrics_start + len(start_tag):lyrics_end].strip()
        
        print (lyrics)
        return lyrics

    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)
