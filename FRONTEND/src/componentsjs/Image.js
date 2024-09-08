import React, { useState ,useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import '../Components/ImageAnalysis.css';
import './FUUU.scss';
import camera from '../images/camera.gif';
// import Navbar1 from '../Components/Navbar1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage    } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Navigationn1 from '../components/navigation1';
const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult,setAnalysisResult]=useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);


  const [chartData, setChartData] = useState(null);
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setUploadedImage(null);
  };

  useEffect(() => {
    if (analysisResult && analysisResult.emotionResult) {
      const predictionsData = analysisResult.emotionResult.predictions;
      const labels = ['Angry', 'Disgust', 'Fear', 'Happiness', 'Sadness', 'Surprise', 'Neutral'];

      const data = labels.map((label, index) => ({
        name: label,
        value: predictionsData[index],
        fill: getBarColor(label),
      }));

      setChartData(data);
    }
  }, [analysisResult]);

  const getBarColor = (emotion) => {
    const emotionColors = {
      Angry: '#FF5733',
      Disgust: '#33FF57',
      Fear: '#3366FF',
      Happiness: '#FFD700',
      Sadness: '#4B0082',
      Surprise: '#FF33A1',
      Neutral: '#A9A9A9',
    };
    return emotionColors[emotion] || '#8884d8'; // Default color if not found in emotionColors
  };

  const handleUploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('myfile', selectedImage);
      console.log(formData);

      const response = await axios.post('http://127.0.0.1:5000/images', formData);
      // console.log(response);
      const result =response.data;
      console.log(result);
      setIsButtonClicked(true);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error uploading image:', error);
    }

  };

  return (
    <div>
      <Navigationn1 />
      <div className='containerere'>
       
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div>
              <h2 className='x'>IMAGE ANALYSIS</h2>
              <ul className="list-container1">
          <li className="list-item">
            <p>TRENDTROVE takes video input from the user.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
         </li>
         <li>
          
         <img src={camera} alt="Description"  className='vi'/>
         </li>
        </ul>
            </div>
          </div>
          <div style={{ flex: 1 }} className='v'>
            <div className='upload'>
              <div className='upload-files'>
                <label className='custom-file-upload'>
               {/* <header>
           <p>
            <i className="fa fa-cloud-upload" aria-hidden="true"></i>
            <span className="up">up</span>
            <span className="load">load</span>
          </p>
        </header>
        <FontAwesomeIcon icon={faImage   } className="fa asddc pointer-none" aria-hidden="true"/> */}
        
                  <br></br>
                  <br></br>
                  <input type='file' accept='image/*' onChange={handleImageChange} className='xvcc' />
                  Select Image File
                  {selectedImage && (
                    <button onClick={handleRemoveImage} className='remove-file-btn'>
                      {/* <FontAwesomeIcon icon={faTimes} className='fa' aria-hidden='true' /> */}
                      Remove Image
                    </button>
                  )}
                </label>
                {selectedImage && (
                  <div className='selected-file-container'>
                    {/* Display the selected image, if needed */}
                    <img src={URL.createObjectURL(selectedImage)} alt='Selected Image' className='xse' />
                  </div>
                )}
                <button onClick={handleUploadImage} disabled={!selectedImage} className='d'>
                  Upload
                </button>
                {uploadedImage && (
                  <div className='uploaded-file-container'>
                    {/* Display the uploaded image, if needed */}
                    <img src={uploadedImage} alt='Uploaded Image' className='xse' />
                  </div>
                )}
              </div>
            {analysisResult && (
  <div>
    {/* <p>Text: {analysisResult.text}</p>
    <p>Has Text: {analysisResult.hastext ? 'Yes' : 'No'}</p> */}

    {analysisResult.emotionResult && (
      <div>
        <h4>Emotion Result:</h4>
        <p>Is Face: {analysisResult.emotionResult.isFace ? 'Yes' : 'No'}</p>
        <p>No Face: {analysisResult.emotionResult.noFace}</p>
        <p>Emotion: {analysisResult.emotionResult.emotion}</p>
        {/* <p>Predictions: {JSON.stringify(analysisResult.emotionResult.predictions)}</p> */}
      </div>
    )}
  </div>
)}
            </div>
          </div>
        </div>
       <br></br><br></br>
      
      {isButtonClicked && analysisResult && chartData && (
        <div className="chart-container">
<h2>ANALYSIS RESULT:</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          
          </ResponsiveContainer>
        </div>
      )}
      </div>
    </div>
  );
};

export default ImageAnalysis;