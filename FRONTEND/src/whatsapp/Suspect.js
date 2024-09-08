import { FaRegCalendarAlt, FaRegClock, FaRegChartBar, FaRegSmile,FaMeh, FaRegFrown,FaMapMarkedAlt  } from 'react-icons/fa';
import React, { useState } from 'react';
import axios from 'axios';
import './Suspect.css';
import Modal from './Modal';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image , PDFDownloadLink } from '@react-pdf/renderer';
import Navigationn2 from '../components/navigation2';


const Suspect = () => {
  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [response, setResponse] = useState(null);
  const [theme, setTheme] = useState('light');
  const [hoveredBoxContent, setHoveredBoxContent] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    toggleModal();
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('selected_user', selectedUser);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      setResponse(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  
  const handleHover = (content) => {
    setHoveredBoxContent(content);
  };

  const handleCloseHoveredBox = () => {
    setHoveredBoxContent(null);
  };


  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 8,
    },
    text: {
      fontSize: 14,
      marginBottom: 5,
    },
    image: {
      marginBottom: 10,
      maxWidth: '100%',
      maxHeight: 200,
    },
  });

  // Generate PDF document
  const PdfDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Analysis Results</Text>
          <Text style={styles.subtitle}>Sentiment Analysis</Text>
          <Text style={styles.text}>{response?.sentiment}</Text>
          <Text style={styles.subtitle}>Statistics of Uploaded Messages</Text>
          <Text style={styles.text}>Number of Messages: {response?.stats.num_messages}</Text>
          <Text style={styles.text}>Words: {response?.stats.words}</Text>
          <Text style={styles.text}>Number of Media Messages: {response?.stats.num_media_messages}</Text>
          <Text style={styles.text}>Number of Links: {response?.stats.num_links}</Text>
          {/* Include other analysis results as needed */}
        </View>
        {response.stats.common_words_img && (
          <View style={styles.section}>
            <Text style={styles.title}>Common Words</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.common_words_img}`} />
          </View>
        )}
        {response.stats.daily_timeline_img && (
          <View style={styles.section}>
            <Text style={styles.title}>Daily Timeline</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.daily_timeline_img}`} />
          </View>
        )}
        {response.stats.busy_day_img && (
          <View style={styles.section}>
            <Text style={styles.title}>Busy Day Timeline</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.busy_day_img}`} />
          </View>
        )}
        {response.stats.busy_month_img && (
          <View style={styles.section}>
            <Text style={styles.title}>Busy Month Timeline</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.busy_month_img}`} />
          </View>
        )}
        {response.stats.heatmap_img && (
          <View style={styles.section}>
            <Text style={styles.title}>HeatMap</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.heatmap_img}`} />
          </View>
        )}
        {response.stats.wordcloud_img && (
          <View style={styles.section}>
            <Text style={styles.title}>WordCloud</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.wordcloud_img}`} />
          </View>
        )}
        {response.stats.monthly_timeline_img && (
          <View style={styles.section}>
            <Text style={styles.title}>Mothly Timeline</Text>
            <Image style={styles.image} src={`data:image/png;base64,${response.stats.monthly_timeline_img}`} />
          </View>
        )}
      </Page>
    </Document>
  );


  return (
    <div>
   
         <div className="sidebar">
         <Navigationn2/>
   
       
  
      <main className="main-content">
        <center><h2>Empowering world through Emotional Intelligence</h2></center>
        <div class="form-container">
  <p className='psd'>
    Note: Uploading a WhatsApp chat as a text file allows for sentiment analysis to predict emotions expressed, aiding in cybercrime investigations by discerning potential conflicts or suspicious activities within the chat.
  </p>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="fileInput">Select File:</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />
    </div>
    <div>
      <label htmlFor="userInput">Select User:</label>
      <input type="text" id="userInput" value={selectedUser} onChange={handleUserChange} />
    </div>
    <button type="submit">Upload</button>
  </form>
</div>

    
      </main>
     </div>
 
     {response && (
      <div className={` ${theme}-theme`}>
     <div className="response-container">
   
      <br></br><br></br><br></br>
      <div className="response-container12">
      <div className="response-box">
     
           <h3> <FaRegSmile /> <FaMeh /> <FaRegFrown /> Response: </h3>
          
           <p><h4>Status: {response.status}</h4></p>
           <p><h4>Sentiment:</h4> <h4>{response.sentiment}</h4></p>
           </div>
           <div className="response-box">  
           
           <p><h3> <FaRegChartBar className="icon" />Statistics of uploaded message:</h3></p>
           <ul>
            <h4>
             <li>Number of Messages: {response.stats.num_messages}</li>
             <li>Words: {response.stats.words}</li>
             <li>Number of Media Messages: {response.stats.num_media_messages}</li>
             <li>Number of Links: {response.stats.num_links}</li>
             </h4>
           </ul>
           </div>
           </div>
           </div>
           <br></br>   <br></br><br></br><br></br>
           
           <div className="custom-container container114">
   {response.stats.common_words_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.common_words_img)}>
          <h3>Common Words:</h3>
          <img src={`data:image/png;base64,${response.stats.common_words_img}`} alt="Common Words" />
        </div>
   )}
         {response.stats.daily_timeline_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.daily_timeline_img)}>
          <h3><FaRegClock className="icon" />Daily Timeline:</h3>
          <img src={`data:image/png;base64,${response.stats.daily_timeline_img}`} alt="Daily Timeline" />
        </div>
      )}
      {response.stats.busy_day_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.busy_day_img)}>
          <h3><FaMapMarkedAlt className="icon" />Busy Day Activity Map:</h3>
          <img src={`data:image/png;base64,${response.stats.busy_day_img}`} alt="Busy Day Activity Map" />
        </div>
      )}
      {response.stats.busy_month_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.busy_month_img)}>
          <h3>Busy Month Activity Map:</h3>
          <img src={`data:image/png;base64,${response.stats.busy_month_img}`} alt="Busy Month Activity Map" />
        </div>
      )}
            {response.stats.heatmap_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.heatmap_img)}>
          <h3>Activity Heatmap:</h3>
          <img src={`data:image/png;base64,${response.stats.heatmap_img}`} alt="Activity Heatmap" />
        </div>
      )}
      {response.stats.wordcloud_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.wordcloud_img)}>
          <h3>WordCloud:</h3>
          <img src={`data:image/png;base64,${response.stats.wordcloud_img}`} alt="Common Words" />
        </div>
      )}
      {response.stats.monthly_timeline_img && (
        <div className="custom-box" onClick={() => handleImageClick(response.stats.monthly_timeline_img)}>
          <h3>Monthly Timeline:</h3>
          <img src={`data:image/png;base64,${response.stats.monthly_timeline_img}`} alt="Common Words" />
        </div>
      )}
            {/* Your existing code */}
            {response.stats.emoji_table && (
        <div className="emoji-table">
          <h3>Emoji Usage:</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Emoji</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody dangerouslySetInnerHTML={{ __html: response.stats.emoji_table }} />
          </table>
        </div>
      )}
      {modalIsOpen && selectedImage && <Modal image={selectedImage} onToggle={toggleModal} />}
      <PDFDownloadLink document={<PdfDocument />} fileName="analysis_results.pdf" className="download-button">
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
  </div>
         </div>
        

     )
   }
   </div>   
  )
};

export default Suspect;
// import { FaRegCalendarAlt, FaRegClock, FaRegChartBar, FaRegSmile,FaMeh, FaRegFrown,FaMapMarkedAlt  } from 'react-icons/fa';
// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';
// import Modal from './Modal';

// const UploadFileForm = () => {
//   const [file, setFile] = useState(null);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [response, setResponse] = useState(null);
//   const [theme, setTheme] = useState('light');
//   const [hoveredBoxContent, setHoveredBoxContent] = useState(null);
//   const [expandedImage, setExpandedImage] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const toggleModal = () => {
//     setModalIsOpen(!modalIsOpen);
//   };

//   const handleImageClick = (imageData) => {
//     setSelectedImage(imageData);
//     toggleModal();
//   };


//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUserChange = (event) => {
//     setSelectedUser(event.target.value);
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('selected_user', selectedUser);

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log(response);
//       setResponse(response.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       // Handle error
//     }
//   };

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };

  
//   const handleHover = (content) => {
//     setHoveredBoxContent(content);
//   };

//   const handleCloseHoveredBox = () => {
//     setHoveredBoxContent(null);
//   };


//   const handleCloseExpandedImage = () => {
//     setExpandedImage(null);
//   };

//   return (
//     <div>
   
//          <div className="sidebar">
//       <nav className="navbar">
//         <div className="logo">
//           <img src="logo.png" alt="Logo" />
          
//         </div>
//         <button className="theme-toggle" onClick={toggleTheme}>Toggle Theme</button>
//       </nav>
   
       
  
//       <main className="main-content">
//         <center><h2>Empowering world through Emotional Intelligence</h2></center>
//         <div class="form-container">
//   <p>
//     Note: Uploading a WhatsApp chat as a text file allows for sentiment analysis to predict emotions expressed, aiding in cybercrime investigations by discerning potential conflicts or suspicious activities within the chat.
//   </p>
//   <form onSubmit={handleSubmit}>
//     <div>
//       <label htmlFor="fileInput">Select File:</label>
//       <input type="file" id="fileInput" onChange={handleFileChange} />
//     </div>
//     <div>
//       <label htmlFor="userInput">Select User:</label>
//       <input type="text" id="userInput" value={selectedUser} onChange={handleUserChange} />
//     </div>
//     <button type="submit">Upload</button>
//   </form>
// </div>

    
//       </main>
//      </div>
 
//      {response && (
//       <div className={` ${theme}-theme`}>
//      <div className="response-container">
   
//       <br></br><br></br><br></br>
//       <div className="response-container12">
//       <div className="response-box">
     
//            <h3> <FaRegSmile /> <FaMeh /> <FaRegFrown /> Response: </h3>
          
//            <p><h4>Status: {response.status}</h4></p>
//            <p><h4>Sentiment:</h4> <h4>{response.sentiment}</h4></p>
//            </div>
//            <div className="response-box">  
           
//            <p><h3> <FaRegChartBar className="icon" />Statistics of uploaded message:</h3></p>
//            <ul>
//             <h4>
//              <li>Number of Messages: {response.stats.num_messages}</li>
//              <li>Words: {response.stats.words}</li>
//              <li>Number of Media Messages: {response.stats.num_media_messages}</li>
//              <li>Number of Links: {response.stats.num_links}</li>
//              </h4>
//            </ul>
//            </div>
//            </div>
//            </div>
//            <br></br>   <br></br><br></br><br></br>
           
//            <div className="custom-container">
//    {response.stats.common_words_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.common_words_img)}>
//           <h3>Common Words:</h3>
//           <img src={`data:image/png;base64,${response.stats.common_words_img}`} alt="Common Words" />
//         </div>
//    )}
//          {response.stats.daily_timeline_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.daily_timeline_img)}>
//           <h3><FaRegClock className="icon" />Daily Timeline:</h3>
//           <img src={`data:image/png;base64,${response.stats.daily_timeline_img}`} alt="Daily Timeline" />
//         </div>
//       )}
//       {response.stats.busy_day_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.busy_day_img)}>
//           <h3><FaMapMarkedAlt className="icon" />Busy Day Activity Map:</h3>
//           <img src={`data:image/png;base64,${response.stats.busy_day_img}`} alt="Busy Day Activity Map" />
//         </div>
//       )}
//       {response.stats.busy_month_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.busy_month_img)}>
//           <h3>Busy Month Activity Map:</h3>
//           <img src={`data:image/png;base64,${response.stats.busy_month_img}`} alt="Busy Month Activity Map" />
//         </div>
//       )}
//             {response.stats.heatmap_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.heatmap_img)}>
//           <h3>Activity Heatmap:</h3>
//           <img src={`data:image/png;base64,${response.stats.heatmap_img}`} alt="Activity Heatmap" />
//         </div>
//       )}
//       {response.stats.wordcloud_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.wordcloud_img)}>
//           <h3>WordCloud:</h3>
//           <img src={`data:image/png;base64,${response.stats.wordcloud_img}`} alt="Common Words" />
//         </div>
//       )}
//       {response.stats.monthly_timeline_img && (
//         <div className="custom-box" onClick={() => handleImageClick(response.stats.monthly_timeline_img)}>
//           <h3>Monthly Timeline:</h3>
//           <img src={`data:image/png;base64,${response.stats.monthly_timeline_img}`} alt="Common Words" />
//         </div>
//       )}
//             {/* Your existing code */}
//             {response.stats.emoji_table && (
//         <div className="emoji-table">
//           <h3>Emoji Usage:</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>No</th>
//                 <th>Emoji</th>
//                 <th>Count</th>
//               </tr>
//             </thead>
//             <tbody dangerouslySetInnerHTML={{ __html: response.stats.emoji_table }} />
//           </table>
//         </div>
//       )}
//       {modalIsOpen && selectedImage && <Modal image={selectedImage} onToggle={toggleModal} />}
//   </div>
//          </div>
        

//      )
//    }
//    </div>   
//   )
// };

// export default UploadFileForm;