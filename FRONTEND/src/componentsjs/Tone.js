// import React, { useState , useEffect} from 'react';
// // import '../Components/ImageAnalysis.css';
// import './FUxx.scss';
// import tone from '../images/tone.gif';
// import Navigation1 from '../components/navigation1';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
//     const Tone = () => {
//       const [selectedFile, setSelectedFile] = useState(null);
//       const [uploadedFile, setUploadedFile] = useState(null);
//       const [analysisResult, setAnalysisResult] = useState(); //
//     const [files, setFiles] = useState(null);
//       const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         setSelectedFile(file);
//       };
    
      

//       const handleImportClick = async (file) => {
//         const formData = new FormData();
//         // files.forEach((file) => {
//         //   formData.append('myfile', file);
//         // });

//         formData.append('myfile',selectedFile);
//         console.log(formData);
    
//         try {
//           console.log("hello i am inside")
//           const response = await axios.post('http://127.0.0.1:5000/get_chatgpt_response',formData); 
//           console.log(response);
//           // Handle the response as needed
//           const result = response.data;
//           // console.log(result+" Result ");
//           setAnalysisResult(result);
//           // setFiles([]);
//         } catch (error) {
//           console.error('Error uploading files:', error);
//         }
    
//         // Logic to update files
//       };
    
//   return (
//     <div>
//         <Navigation1/>
//         <div  className='container11s'>
        
//         <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         <div>
//           <h2 className='x'>EMOTIONAL TONE ANALYSIS</h2>
//           <ul className="list-container1">
//           <li className="list-item">
//             <p>TRENDTROVE takes audio  input from the user.</p>
//           </li>
//           <li className="list-item">
//             <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
//           </li>
//           <li>
//           <img src={tone} alt="Description"  className='vi'/>
//         </li>
//         </ul>
//         </div>
//       </div>
//       <div style={{ flex: 1 }} className='v'>
//       <div className="upload">
//       <div className="upload-files">
//       <label className="custom-file-upload">
//         <input type="file" accept="audio/*" onChange={handleFileChange} />
//         Select Audio File
//       </label>
//       {selectedFile && (
//         <div className="selected-file-container">
//           <p>Selected File:</p>
//           <audio controls>
//             <source src={URL.createObjectURL(selectedFile)} type="audio/mpeg" />
//             Your browser does not support the audio tag.
//           </audio>
//         </div>
//       )}
//       <button onClick={handleImportClick} disabled={!selectedFile}>
//         Upload
//       </button>
//       {uploadedFile && (
//         <div className="uploaded-file-container">
//           <p>Uploaded File:</p>
//           <audio controls>
//             <source src={uploadedFile} type="audio/mpeg" />
//             Your browser does not support the audio tag.
//           </audio>
//         </div>
//       )}
      
//         </div>
//     </div>
//       </div>
//     </div>
//     </div>
//     <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
//         {analysisResult && (
//           <div className='.xux'>
//             <h2>Predicted Result </h2>
//             <p>The Predicted result : {analysisResult.predicted_feeling}</p>
//           </div>
//         )}
//         </div>

//   );
// };

// export default Tone;

import React, { useState } from 'react';
import './FUxx.scss';
import tone from '../images/tone.gif';
import Navigation1 from '../components/navigation1';
import axios from 'axios';

const Tone = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleImportClick = async () => {
    const formData = new FormData();
    formData.append('myfile', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/get_chatgpt_response', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type header for FormData
        },
      });

      const result = response.data;
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <Navigation1 />
      <div className='container11s'>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div>
              <h2 className='x'>EMOTIONAL TONE ANALYSIS</h2>
              <ul className='list-container1'>
                <li className='list-item'>
                  <p>TRENDTROVE takes audio input from the user.</p>
                </li>
                <li className='list-item'>
                  <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
                </li>
                <li>
                  <img src={tone} alt='Description' className='vi' />
                </li>
              </ul>
            </div>
          </div>
          <div style={{ flex: 1 }} className='v'>
            <div className='upload'>
              <div className='upload-files'>
                <label className='custom-file-upload'>
                  <input type='file' accept='audio/*' onChange={handleFileChange} />
                  Select Audio File
                </label>
                {selectedFile && (
                  <div className='selected-file-container'>
                    <p>Selected File:</p>
                    <audio controls>
                      <source src={URL.createObjectURL(selectedFile)} type='audio/mpeg' />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}
                <button onClick={handleImportClick} disabled={!selectedFile}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {analysisResult && (
        <div className='.xux'>
          <h2>Predicted Result </h2>
          <p>The Predicted result : {analysisResult.predicted_feeling}</p>
        </div>
      )}
    </div>
  );
};

export default Tone;
