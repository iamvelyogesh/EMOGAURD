import React, { useState , useEffect} from 'react';
// import '../Components/ImageAnalysis.css';
import './FUU.scss';
import Navigationn1 from '../components/navigation1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import audio from '../images/images/audio.gif';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
// import Navigationn1 from '../components/navigation1';
    const Audanalysis = () => {
      const [selectedFile, setSelectedFile] = useState(null);
      const [uploadedFile, setUploadedFile] = useState(null);
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
    const [files, setFiles] = useState(null);
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };
      
      Chart.register(ArcElement); 

      const handleImportClick = async (file) => {
        const formData = new FormData();
        // files.forEach((file) => {
        //   formData.append('myfile', file);
        // });

        formData.append('myfile',selectedFile);
    
        try {
          const response = await axios.post('http://127.0.0.1:5000/audio',formData); 
          console.log(response);
          // Handle the response as needed
          const result = response.data;
          // console.log(result+" Result ");
           
          setAnalysisResult(result);
          setIsButtonClicked(true);
          // setFiles([]);
        } catch (error) {
          console.error('Error uploading files:', error);
        }
    
        // Logic to update files
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
        <Navigationn1/>
        <div  className='container111'>
       
        <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div>
          <h2 className='x'>Audio Analysis</h2>
          <ul className="list-container2  ">
          <li className="list-item">
            <p>
Analyzing the audio reveals a tapestry of emotional intricacies, from nuanced harmonics to dynamic amplitude fluctuations.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          <div className='text'>
          <img src={audio} alt="Description" className='fg' />
          </div>
        </ul>
        </div>
      </div>
      <div style={{ flex: 1 }} className='v'>
        
      <div className="upload">
      <div className="upload-files">
      <label className="custom-file-upload">
        <br></br><br></br>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <span>Choose Audio File</span>
          </label>
     
      <br></br><br></br>
      {selectedFile && (
        <div className="selected-file-container">
          <p>Selected File:</p>
          <audio controls>
            <source src={URL.createObjectURL(selectedFile)} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
      <br></br>
      <div className='audio-controls'>
      <button style={buttonStyle}onClick={handleImportClick} disabled={!selectedFile}>
        Upload
      </button></div>

      {uploadedFile && (
        <div className="uploaded-file-container">
          <p>Uploaded File:</p>
          <audio controls>
            <source src={uploadedFile} type="audio/mpeg" className='asdxsd'/>
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
       
        </div>
    </div>
      </div>
    </div>
    <div className='w'>
    {isButtonClicked && analysisResult && (
        
        <div>
         
          
            {analysisResult.sentiment && (
              <div>
                <h2>Sentiment Analysis:</h2>
                <h3>Analysis Result:</h3>
<p>Text: {analysisResult.text}</p>

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
            
          )}
    </div>
    </div>
    </div>
  );
};

export default Audanalysis;