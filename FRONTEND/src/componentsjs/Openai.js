import React, { useState } from 'react';
import './TextA.css';
import axios from 'axios'; 
import { Navigationn1 } from '../components/navigation1';
import text from '../images/text.gif';
import { PieChart, Pie, Cell } from 'recharts';

const Open = () => {
  const [inputText, setInputText] = useState('');
  // const [analysisResult, setAnalysisResult] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [IS, setIS] = useState(false);
  const [isThreat, setIsThreat] = useState(false);

  // const handleTextAnalysis = async () => {
  //   try {
  //     // Make a POST request to your Flask server
  //     const response = await axios.post('http://127.0.0.1:5000/get_chatgpt_response', {
  //       text: inputText,
  //     });
  //     console.log(response);
  //     const result = response.data.chat;
  //     console.log(result);
  //     // const result1 = response.data.emotion;
  //     // console.log(result1);
  //     // Set the analysis result based on the response from the server
  //     setAnalysisResult(result);
  //     setIS(true);
  //   } catch (error) {
  //     console.error('Error while making the request:', error);
  //     // Handle errors here
  //   }
  //   // setAnalysisResult('This is a dummy analysis result.');
  // };
  const handleTextAnalysis = async () => {
    try {
      // Make a POST request to your Flask server
      const response = await axios.post('http://127.0.0.1:5000/get_chatgpt_response', {
        text: inputText,
      });
      console.log(response);
      const result = response.data.chat;
      
      // Check if the result contains threatening words
      const threatWords = ["negative", "anger", "kill"];
      const isThreat = threatWords.some(word => result.toLowerCase().includes(word));
      
      if (isThreat) {
        const action = window.confirm("Threat identified in the text. Do you want to inform the police?");
        if (action) {
          const choice = window.confirm(
            "Choose an action:\n\n1. Call 100 (Emergency)"
          );
          if (choice) {
            // Call 100 (Emergency)
            // You can implement this part according to your requirements
            alert("Calling 100 (Emergency)...");
          } 
        }
      }
      
      setIsThreat(isThreat);
      // Set the analysis result based on the response from the server
      setAnalysisResult(result);
      setIS(true);
    } catch (error) {
      console.error('Error while making the request:', error);
      // Handle errors here
    }
  };
  
  const data = [
    { name: 'Threatening Words', value: isThreat ? 1 : 0 },
    { name: 'Neutral', value: isThreat ? 0 : 1 },
  ];

  const COLORS = ['#FF5733', '#36A2EB'];


 
  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  }
 

  return (
    <div>
    <div className='vc'>
        <Navigationn1/>
        <div  className='con'>
    
        <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div>
          <h2 className='x'>Text Analysis</h2>
          <ul className="list-container2">
          <li className="list-item">
            <p>
Text analysis employs computational methods to extract meaningful insights and patterns from written content, facilitating tasks such as sentiment analysis and information extraction.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          <li>
            <div className='text'>
          <img src={text} alt="Description" className='xd' />
          </div>
          </li>
        </ul>
        </div>
      </div>
      <div style={{ flex: 1}} className='text12'>
       
        <textarea
          placeholder="Enter text for analysis..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
       
      <button onClick={handleTextAnalysis} className='b'> Analyse Text </button>
  <div>
   
   </div>
    
  </div>
  </div>
  <br></br><br></br><br></br><br></br><br></br>
  { IS && analysisResult &&(
    
     <div>
      <h2>Analysis Result:</h2>
      <div className='list-container212'>
        <br></br><br></br>
              <p>{analysisResult}</p>
              </div>
    </div>
    
  )};
  <div>
            {isThreat && (
              <div style={{ marginTop: '20px' }}>
                <h2>Threat Level Depiction</h2>
                <PieChart width={600} height={400}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return (
                        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                          {`${(value * 100).toFixed(2)}% ${index === 0 ? 'Threat' : 'No Threat'}`}
                        </text>
                      );
                    }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            )}
          </div>
  </div>
  </div>
  </div>
);
};

    
  
  
export default Open;
