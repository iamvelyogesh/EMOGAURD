import React, { useState } from 'react';
import axios from 'axios';
import './Red.css'; // Assuming you have a stylesheet for Reddit component
import Navigationn2 from '../components/navigation2';
import defaultImage from '../images/images/reddit.png'; // Replace with the actual image path
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Reddit = () => {
  const [subreddit, setSubreddit] = useState('');
  const [data, setData] = useState([]);
  const [overallSentiment, setOverallSentiment] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/fetch_data', { subreddit });
      const { results, overall_sentiment } = response.data;

      setOverallSentiment(overall_sentiment);
      setData(results);
    } catch (error) {
      console.error('Error sending subreddit:', error);
    }
  };

  const renderTable = () => (
    <div>
      <h2>Overall Sentiment</h2>
    <table>
      <thead>
        <tr>
          <th>Comment</th>
          <th>Sentiment</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.comment}</td>
            <td>{item.sentiment}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>  
  );

  const renderOverallSentiment = () => (
    <div>
      {overallSentiment ? (
        <div>
          <h2 className='xcvf'>Analysis Report</h2>
          <div className='wad'>
            {/* <p>Positive: {overallSentiment.positive}%</p>
            <p>Negative: {overallSentiment.negative}%</p>
            <p>Neutral: {overallSentiment.neutral}%</p> */}
  
            <PieChart width={500} height={500} className='df'>
              <Pie
                data={[
                  { name: 'Positive', value: overallSentiment.positive },
                  { name: 'Negative', value: overallSentiment.negative },
                  { name: 'Neutral', value: overallSentiment.neutral },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={170}
                fill="#8884d8"
                label
              >
                {[
                  { fill: '#36A2EB' },
                  { fill: '#FF6384' },
                  { fill: '#FFCE56' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
  
          <div className='legend'>
            <div className='legend-item'>
              <span className='legend-color negative' style={{ backgroundColor: '#FF6384', width: '30px', height: '30px', borderRadius: '50%', margin: '5px', fontSize: '200px', alignItems: 'center', justifyContent: 'center' }}></span>
              <p className='x'>Negative</p>
            </div>
            <div className='legend-item'>
              <span className='legend-color neutral' style={{ backgroundColor: '#FFCE56', width: '30px', height: '30px', borderRadius: '50%', margin: '5px' }}></span>
              Neutral
            </div>
            <div className='legend-item'>
              <span className='legend-color positive' style={{ backgroundColor: '#36A2EB', width: '30px', height: '30px', borderRadius: '50%', margin: '5px' }}></span>
              Positive
            </div>
          </div>
        </div>
      ) : (
        <p>No overall sentiment data available</p>
      )}
    </div>
  );
  

  

  return (
    <div>
      <Navigationn2 />
      <div className='container113'>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div>
              <h2 className='x'>About</h2>
              <div className='ws'>
                <img src={defaultImage} alt='about' />
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 className='x'>Reddit Analysis</h2>
            <label>
              
            <textarea
              placeholder="Enter text for analysis..."
                value={subreddit}
                className='svc'
                onChange={(e) => setSubreddit(e.target.value)}
              />
            </label><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
              <button onClick={fetchData}>Fetch Data</button>
          </div>
        </div>

        {renderTable()}
        {renderOverallSentiment()}

      </div>
    </div>
  );
};

export default Reddit;
