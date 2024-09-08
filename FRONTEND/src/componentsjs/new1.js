import React, { useState } from 'react';
import './PA.css';
import axios from 'axios'; 
// import Navbar1 from './Navbar1';
import Navigationn1 from '../components/navigation1';

const PaP = () => {
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
      console.log(result);
      // const result1 = response.data.emotion;
      // console.log(result1);
      // Set the analysis result based on the response from the server
      const formattedEmotions = Object.entries(result)
  .map(([emotion, count]) => `${emotion}: ${count}`)
  .join(', ');

// Set the analysis result based on the formatted emotions
setAnalysisResult(formattedEmotions);
      // setAnalysisResult(result);
      const emotionResponses = response.data.emotion_responses;

      // Display overall percentages
     
      
    } catch (error) {
      console.error('Error while making the request:', error);
      // Handle errors here
    }
    // setAnalysisResult('This is a dummy analysis result.');
  };
  return (
    <div>
        <Navigationn1/>
        <div  className='container11'>
        <h1 className='sdaasd'>Detecting and Monitoring Hate Content</h1>
        <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div>
          <h2 className='x'>About</h2>
          <ul className="list-container">
          <li className="list-item">
            <p>UndoHate takes text, image, video, and audio input from the user.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          <li className="list-item">
            <p>It also finds the hate percentage in the input.</p>
          </li>
          <li className="list-item">
            <p>For text, image, and video input, it hides or blurs the hate content.</p>
          </li>
          <li className="list-item">
            <p>For audio, the hate part is muted.</p>
          </li>
          <li className="list-item">
            <p>
              In the case of text, it also suggests alternatives to rephrase it to remove hate content while preserving
              the emotion in the text.
            </p>
          </li>
        </ul>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h2 className='x'>Text Analysis</h2>
        <textarea
          placeholder="Enter text for analysis..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleTextAnalysis}>Analyse Text</button>
      </div>
    </div>
          <h3>Analysis Result:</h3>
              <p>{analysisResult}</p>
    </div>
    </div>
  );
};

export default PaP;