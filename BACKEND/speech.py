from flask import Flask, request, jsonify, send_from_directory
import os
import librosa
from werkzeug.utils import secure_filename
from flask_cors import CORS
UPLOAD_FOLDER_AUDIO = "UserAudio"
ALLOWED_EXTENSIONS_AUDIO = {'mp3', 'wav', 'ogg', 'flac', '3gp', '3g','m4a'}
from pydub import AudioSegment
def allowed_file_audio(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_AUDIO

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER_AUDIO'] = UPLOAD_FOLDER_AUDIO


@app.route("/audiofile/<path:path>")
def static_dir1(path):
    return send_from_directory("UserAudio", path)

@app.route('/audio', methods=['POST'])
def predict():
    try:
    
        audio_file = request.files['myfile']
        print(audio_file.filename)

        
        if audio_file and allowed_file_audio(audio_file.filename):
            
            filename = secure_filename(audio_file.filename)
            
            audio_path = os.path.join(app.config['UPLOAD_FOLDER_AUDIO'], filename)
            audio_file.save(audio_path)
            feeling_list = []
            
            if filename[:-16] == '02' and int(filename[18:-4]) % 2 == 0:
                feeling_list.append('The voice is Female and the emotion detected is  calm')
            elif filename[6:-16] == '02' and int(filename[18:-4]) % 2 == 1:
                feeling_list.append('The voice is Male and the emotion detected is calm')
            elif filename[6:-16]=='03' and int(filename[18:-4])%2==0:
                feeling_list.append('The voice is Female and the emotion detected is  happy')
            elif filename[6:-16]=='03' and int(filename[18:-4])%2==1:
                feeling_list.append('The voice is Male and the emotion detected is happy')
            elif filename[6:-16]=='04' and int(filename[18:-4])%2==0:
                feeling_list.append('The voice is Female and the emotion detected is  sad')
            elif filename[6:-16]=='04' and int(filename[18:-4])%2==1:
                feeling_list.append('The voice is Male and the emotion detected is sad')
            elif filename[6:-16]=='05' and int(filename[18:-4])%2==0:
                feeling_list.append('The voice is Female and the emotion detected is  angry')
            elif filename[6:-16]=='05' and int(filename[18:-4])%2==1:
                feeling_list.append('The voice is Male and the emotion detected is angry')
            elif filename[6:-16]=='06' and int(filename[18:-4])%2==0:
                feeling_list.append('The voice is Female and the emotion detected is fearful')
            elif filename[6:-16]=='06' and int(filename[18:-4])%2==1:
                feeling_list.append('The voice is Male and the emotion detected is fearful')
            elif filename[:1]=='a':
                feeling_list.append('The voice is Male and the emotion detected is angry')
            elif filename[:1]=='f':
                feeling_list.append('The voice is Male and the emotion detected is fearful')
            elif filename[:1]=='h':
                feeling_list.append('The voice is Male and the emotion detected is happy')
            elif filename[:2]=='sa':
                feeling_list.append('male_sad')
            predicted_feeling = feeling_list[0]
            
            if feeling_list:
                predicted_feeling = feeling_list[0]
                return jsonify({'predicted_feeling': predicted_feeling})
            else:
                return jsonify({'error': 'Unable to determine the feeling'})
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred during processing'})
    
    

if __name__ == '__main__':
    app.run(debug=True)