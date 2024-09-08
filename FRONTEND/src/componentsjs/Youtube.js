import React, { useState,useEffect } from 'react';
// import { PieChart } from 'react-minimal-pie-chart';
import { PieChart as RechartsPieChart, Pie, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import Navigationn2 from '../components/navigation2';
import './cv.css';
const Youtube = () => {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [likeResult, setlikeResult] = useState('');
  const [viewResult, setviewResult] = useState('');
  

  const handleTextAnalysis = async () => {
    try {
      // Make a POST request to your Flask server
      const response = await axios.post('http://127.0.0.1:5000/result', {
        keyword: inputText, // Change 'keyword' to 'text'
      });

      
      const result = response.data.Result;
      console.log(result);
      const res=response.data.like;
      console.log(res);
      const res1=response.data.view;
      console.log(res1);
      

      setAnalysisResult(result);
      setlikeResult(res);
      setviewResult(res1);
    } catch (error) {
      console.error('Error while making the request:', error);
      // Handle errors here
    }
  };

  const [barChartData, setBarChartData] = useState([
    { name: 'Likes', value: likeResult },
    { name: 'Views', value: viewResult },
  ]);

  useEffect(() => {
    setBarChartData([
      { name: 'Likes', value: likeResult },
      { name: 'Views', value: viewResult },
    ]);
  }, [likeResult, viewResult]);

  // const pieChartDataSentiment = [
  //   { title: 'Positive', value: analysisResult.positive, color: '#36A2EB' },
  //   { title: 'Negative', value: analysisResult.negative, color: '#FF6384' },
  //   { title: 'Neutral', value: analysisResult.neutral, color: '#FFCE56' },
  // ];

  // const pieChartDataLikesViews = [
  //   { title: 'Likes', value: likeResult, color: '#FFCE56' },
  //   { title: 'Views', value: viewResult, color: '#4CAF50' },
  // ];

  const [pieChartDataSentiment, setPieChartDataSentiment] = useState([
    { name: 'Positive', value: analysisResult.positive, fill: '#3cba54' },
    { name: 'Negative', value: analysisResult.negative, fill: '#db3236' },
    { name: 'Neutral', value: analysisResult.neutral, fill: '#f4c20d' },
  ]);

  useEffect(() => {
    setPieChartDataSentiment([
      { name: 'Positive', value: analysisResult.positive, fill: '#3cba54' },
      { name: 'Negative', value: analysisResult.negative, fill: '#db3236' },
      { name: 'Neutral', value: analysisResult.neutral, fill: '#f4c20d' },
    ]);
  }, [analysisResult]);


  return (
    <div>
      <Navigationn2/>
      <div className='jh'>
      <h2>Youtube Analysis</h2>
      <textarea
        placeholder="Enter text for analysis..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className='mn'
      />
      <button onClick={handleTextAnalysis}>Analyse Text</button>


      <div>
      <table>
        <thead>
          <tr>
            <th>Positive</th>
            <th>Negative</th>
            <th>Neutral</th>
            <th>Polarity</th>
            <th>Subjectivity</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{analysisResult.positive}</td>
            <td>{analysisResult.negative}</td>
            <td>{analysisResult.neutral}</td> 
            <td>{analysisResult.polarity}</td>
            <td>{analysisResult.subjectivity}</td>
            <td>{analysisResult.score}</td>
          </tr>
        </tbody>
      </table>

      {/* <h2>Video Details</h2> */}
      <table>
        <thead>
          <tr>
            <th>Like</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{likeResult}</td>
            <td>{viewResult}</td>
          </tr>
        </tbody>
      </table>
       {/* <h2>Sentiment Pie Chart</h2>
        <div style={{ width: '300px', margin: 'auto' }}>
          <PieChart
            data={pieChartDataSentiment}
            label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
            labelPosition={60}
            labelStyle={{
              fontSize: '5px',
              fontFamily: 'sans-serif',
            }}
          />
        </div> */}

        {/* <h2>Likes and Views Pie Chart</h2> */}
        {/* <div style={{ width: '300px', margin: 'auto' }}>
          <PieChart
            data={pieChartDataLikesViews}
            label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
            labelPosition={60}
            labelStyle={{
              fontSize: '5px',
              fontFamily: 'sans-serif',
            }}
          />
        </div> */}
        {analysisResult && (
        <div className='cv'>
        <h2>Overall Analysis Pie Chart</h2>
      <div style={{ width: '600px', margin: 'auto' }}>
        <RechartsPieChart width={500} height={400}>
          <Pie
            data={pieChartDataSentiment}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={({ percent }) => ` ${(percent * 100).toFixed(2)}%`}
            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
          />
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </div>
      </div>
        )}
<br></br>
{likeResult !== '' && viewResult !== '' && (
    <div className='vc'>
         <h2>Likes and Views Bar Chart</h2>
      <div style={{ width: '600px', margin: 'auto' }}>
        <BarChart width={600} height={400} data={barChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#4CAF50" />
        </BarChart>
      </div>
    </div>
       )}
    </div>
    </div>
    </div>
  );
};

export default Youtube;