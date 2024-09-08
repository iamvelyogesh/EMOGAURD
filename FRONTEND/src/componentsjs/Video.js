import React, { useState, useEffect } from 'react';
// import '../Components/ImageAnalysis.css';
import './FU.scss';
import video from '../images/video.gif';
import { Navigationn1 } from "../components/navigation1"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const VideoAnalysis = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    text: '',
    isHate: '',
    sentiment: {
      compound: 0,
      neg: 0,
      neu: 0,
      pos: 0,
    },
    type: '',
  }); //
  const handleVideoChange = (event) => {
    const video = event.target.files[0];
    setSelectedVideo(video);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setUploadedVideo(null);
  };
  Chart.register(ArcElement); 


  const handleUploadVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('myfile', selectedVideo);
      console.log(formData);

      const response = await axios.post('http://127.0.0.1:5000/video', formData);
      // console.log(response);
      const result =response.data;
      console.log(result);
      setAnalysisResult(result);
      setIsButtonClicked(true);
    } catch (error) {
      console.error('Error uploading image:', error);
    }

  };
  const prepareSentimentChartData = () => {
    const { sentiment } = analysisResult;
    const labels = ['Negative', 'Neutral', 'Positive'];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56'];

    const data = [sentiment.neg, sentiment.neu, sentiment.pos];

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    };
  };
  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    marginLeft: '200px'

  }

const sentimentOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.parsed.y || 0;
          return `${label}: ${value.toFixed(2)}%`;
        },
        title: () => {
          return ''; // Clear title to avoid duplication
        },
      },
      position: 'nearest',
      intersect: false,
    },
    datalabels: {
      formatter: (value, context) => {
        return `${value.toFixed(2)}%`;
      },
      color: '#fff', // Set the color of the text
      display: true,
    },
  },
};
  return (
    <div>
      <Navigationn1 />
      <div className='container234'>
   
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div>
              <h2 className='x'>VIDEO ANALYSIS</h2>
              <ul className="list-container1">
          <li className="list-item">
            <p>TRENDTROVE takes video input from the user.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          <li>
      
          <img src={video} alt="Description"  className='vi'/>
          </li>
        </ul>
            </div>
          </div>
          <div style={{ flex: 1 }} className='v'>
            <div className='upload'>
              <div className='upload-files'>
                <label className='custom-file-upload'>
                <header>
          {/* <p>
            <i className="fa fa-cloud-upload" aria-hidden="true"></i>
            <span className="up">up</span>
            <span className="load">load</span>
          </p> */}
        </header>
        {/* <FontAwesomeIcon icon={faPlay} className="fa asddc pointer-none" aria-hidden="true"/> */}
                  <br></br>
                  <br></br>
                  <input type='file' accept='video/*' onChange={handleVideoChange} className='xvc' />
                  Select Video File
                  {selectedVideo && (
                    <button onClick={handleRemoveVideo} className='remove-file-btn'>
                      Remove Video
                    </button>
                  )}
                </label>
                {selectedVideo && (
                  <div className='selected-file-container'>
                    <video controls className='xse'>
                      <source src={URL.createObjectURL(selectedVideo)} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <br></br><br></br><br></br><br></br>
                <button onClick={handleUploadVideo} disabled={!selectedVideo} style={buttonStyle}>
                  Upload
                </button>
                {uploadedVideo && (
                  <div className='uploaded-file-container'>
                    <video controls>
                      <source src={uploadedVideo} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

  </div>
        </div>
        
      </div>
      
    </div>
    {isButtonClicked && analysisResult && (
        
        <div>
            <h2>Sentiment Analysis:</h2>
          <h3>Analysis Result:</h3>
<p>Text: {analysisResult.text}</p>

          <div>
            {analysisResult.sentiment && (
              <div>
                <div className='pie-chart-container'>
                <Doughnut
data={prepareSentimentChartData()}
options={sentimentOptions}
plugins={[ChartDataLabels]}
/>

                </div>
                <div className='legend'>
                  <div className='legend-item'>
                    <span className='legend-color negative'></span>
                    Negative
                  </div>
                  <div className='legend-item'>
                    <span className='legend-color neutral'></span>
                    Neutral
                  </div>
                  <div className='legend-item'>
                    <span className='legend-color positive'></span>
                    Positive
                  </div>
                </div>
              </div>
            )}
  
          
                </div>
            
            </div>
          )}
    </div>

</div>  );
};

export default VideoAnalysis;