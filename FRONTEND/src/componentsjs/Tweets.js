import React, { useState } from 'react';
import './TextA.css';
import a from '../images/images/t.jpg';
import axios from 'axios'; 
// import Navbar1 from './Navbar1';
import { PieChart } from 'react-minimal-pie-chart';
import Navigationn2 from '../components/navigation2';

const Tweets = () => {
  const [inputText, setInputText] = useState('');
  // const [analysisResult, setAnalysisResult] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  const handleTextAnalysis = async () => {
    try {
      // Make a POST request to your Flask server
      const response = await axios.post('http://127.0.0.1:5000/get_chatgpt_response', {
        text: inputText,
      });
      console.log(response);
      const result = response.data.tweet;
      const formattedEmotions = Object.entries(result).map(([emotion, count]) => ({
        title: emotion,
        value: count,
        color: getColorForEmotion(emotion),
      }));

      setAnalysisResult(formattedEmotions);
    } catch (error) {
      console.error('Error while making the request:', error);
    }
  };

  const getColorForEmotion = (emotion) => {
    // Add your color mappings here based on the emotion
    switch (emotion) {
      case 'anger':
        return 'red';
      case 'disgust':
        return '    ';
      case 'fear':
        return 'purple';
      case 'happiness':
        return 'yellow';
      case 'sadness':
        return 'blue';
      case 'surprise':
        return 'orange';
      default:
        return 'gray';
    }
  };
  
  return (
    <div>
        <Navigationn2/>
        <div  className='containerer'>
      
        <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div>
          <h2 className='x'>WHATSAPP ANALYSIS</h2>
          <ul className="list-container1">
          <li className="list-item">
            <p>UndoHate takes text, image, video, and audio input from the user.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          <img src = {a} className='VF'></img>
        </ul>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        
        <textarea
          placeholder="Enter text for analysis..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleTextAnalysis}>Analyse Text</button>
      </div>
    </div>
    <div className='x2'>
          <h2>Analysis Result:</h2>
          {/* <p>{analysisResult}</p> */}
        {analysisResult && <PieChart data={analysisResult} radius={25} />}
        </div>
    </div>
    </div>
  );
};

export default Tweets;