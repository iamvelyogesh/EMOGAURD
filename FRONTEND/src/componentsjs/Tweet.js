import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip  } from 'recharts';
import './Tweet.css';
import Navigationn2 from '../components/navigation2';

import a from '../images/images/t.jpg';
// ... (import statements)

const Twet = () => {
  const [inputText, setInputText] = useState('');
  const [inputNumber, setInputNumber] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [analysisResult, setAnalysisResult] = useState([]); 
  const [sentimentDistribution, setSentimentDistribution] = useState(null);


  const handleTextAnalysis = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/tweet', {
        word: inputText,
        count: inputNumber, 
        emotion: selectedEmotion,
      });
      const result = response.data.Result;
      setAnalysisResult(result);
      const positiveCount = result.filter((r) => r.compound_score_sentiment === 'Positive').length;
      const negativeCount = result.filter((r) => r.compound_score_sentiment === 'Negative').length;
      const neutralCount = result.filter((r) => r.compound_score_sentiment === 'Neutral').length;

      const total = positiveCount + negativeCount + neutralCount;

      setSentimentDistribution([
        { name: 'Positive', value: positiveCount, percentage: (positiveCount / total) * 100 },
        { name: 'Negative', value: negativeCount, percentage: (negativeCount / total) * 100 },
        { name: 'Neutral', value: neutralCount, percentage: (neutralCount / total) * 100 },
      ]);
    } catch (error) {
      console.error('Error while making the request:', error);
    }
  };

  const renderPieChart = () => {
    if (sentimentDistribution) {
      const COLORS = ['#36A2EB', '#FF6384', '#FFCE56'];

      return (
        <div >
          <h2 className='x1'>Sentiment Distribution</h2>
          <ul className="list-container1">
          <li className="list-item1">
            <p>
WhatsApp analysis employs computational methods to extract meaningful insights and patterns from written content, facilitating tasks such as sentiment analysis and information extraction.</p>
          </li>
          <li className="list-item">
            <p>It analyzes the input and predicts the sentiment or emotion in the content.</p>
          </li>
          
        </ul>
          <div className='rt'>
          <PieChart width={500} height={500} className='df' >
            <Pie
              data={sentimentDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={170}
              fill="#8884d8"
              label
            >
              {sentimentDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} (${name === 'percentage' ? '%' : 'count'})`, name]} />
            
          </PieChart>
         
          <div className='legend'>
            <div className='legend-item'>
              <span className='legend-color negative ' style={{ backgroundColor: COLORS[1], width: '30px', height: '30px', borderRadius: '50%', margin: '5px', fontSize: '200px',alignItems: 'center', justifyContent: 'center' }}></span>
              <p className='x'>Negative</p>
            </div>
            <div className='legend-item'>
              <span className='legend-color neutral' style={{ backgroundColor: COLORS[2], width: '30px', height: '30px', borderRadius: '50%', margin: '5px' }}></span>
              Neutral
            </div>
            <div className='legend-item'>
              <span className='legend-color positive' style={{ backgroundColor: COLORS[0], width: '30px', height: '30px', borderRadius: '50%', margin: '5px' }}></span>
              Positive
            </div>
          </div>

          </div>
        </div>
      );
    }
    return null;
  };

  const renderTable = () => {
    switch (selectedEmotion) {
      case 'all':
        return renderAllTable();
      case 'neg':
        return renderNegativeTable();
      case 'neu':
        return renderNeutralTable();
      case 'pos':
        return renderPositiveTable();
      default:
        return null;
    }
  };

  const renderAllTable = () => {
    return (
      <div className='xc'>
        <h2 className='x'>Sentiment Distribution Table</h2>
      
      <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Polarity</th>
              <th>Subjectivity</th>
              <th>Compound Score</th>
              <th>Compound Score Sentiment</th>
              <th>Text</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Emotion</th>
            </tr>
          </thead>
          <tbody>
            {analysisResult.map((r, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{r.sentiment.polarity}</td>
                <td>{r.sentiment.subjectivity}</td>
                <td>{r.compound_score}</td>
                <td>{r.compound_score_sentiment}</td>
                <td>{r.text}</td>
                <td>{r.user}</td>
                <td>{r.timestamp}</td>
                <td>{r.emotion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    );
  };

  const renderNegativeTable = () => {
    return (
      <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Polarity</th>
          <th>Subjectivity</th>
          <th>Compound Score</th>
          <th>Compound Score Sentiment</th>
          <th>Text</th>
          <th>User</th>
          <th>Timestamp</th>
          <th>Emotion</th>
        </tr>
      </thead>
      <tbody>
        {analysisResult
          .filter((r) => r.compound_score_sentiment === 'Negative')
          .map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.sentiment.polarity}</td>
              <td>{r.sentiment.subjectivity}</td>
              <td>{r.compound_score}</td>
              <td>{r.compound_score_sentiment}</td>
              <td>{r.text}</td>
              <td>{r.user}</td>
              <td>{r.timestamp}</td>
              <td>{r.emotion}</td>
            </tr>
          ))}
      </tbody>
    </table>
    );
  };

  const renderNeutralTable = () => {
    return (
      <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Polarity</th>
          <th>Subjectivity</th>
          <th>Compound Score</th>
          <th>Compound Score Sentiment</th>
          <th>Text</th>
          <th>User</th>
          <th>Timestamp</th>
          <th>Emotion</th>
        </tr>
      </thead>
      <tbody>
        {analysisResult
          .filter((r) => r.compound_score_sentiment === 'Neutral')
          .map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.sentiment.polarity}</td>
              <td>{r.sentiment.subjectivity}</td>
              <td>{r.compound_score}</td>
              <td>{r.compound_score_sentiment}</td>
              <td>{r.text}</td>
              <td>{r.user}</td>
              <td>{r.timestamp}</td>
              <td>{r.emotion}</td>
            </tr>
          ))}
      </tbody>
    </table>
    );
  };

  const renderPositiveTable = () => {
    return (
      <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Polarity</th>
          <th>Subjectivity</th>
          <th>Compound Score</th>
          <th>Compound Score Sentiment</th>
          <th>Text</th>
          <th>User</th>
          <th>Timestamp</th>
          <th>Emotion</th>
        </tr>
      </thead>
      <tbody>
        {analysisResult
          .filter((r) => r.compound_score_sentiment === 'Positive')
          .map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.sentiment.polarity}</td>
              <td>{r.sentiment.subjectivity}</td>
              <td>{r.compound_score}</td>
              <td>{r.compound_score_sentiment}</td>
              <td>{r.text}</td>
              <td>{r.user}</td>
              <td>{r.timestamp}</td>
              <td>{r.emotion}</td>
            </tr>
          ))}
      </tbody>
    </table>
    );
  };

  return (
    <div>
      <Navigationn2/>
      <div className='container113'>
        {/* <h1 className='sdaasd'>Tweet Analysis</h1> */}
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div >
              <h2 className='x'>About</h2>
              <div className='ws'>
                   <img src={a}></img>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 className='x'>Tweet Analysis</h2>
            <textarea
              placeholder="Enter text for analysis..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter number..."
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className='ii'
            />
            <select
              name="emotion"
              id="dropdown"
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(e.target.value)}
              className='ii'
            >
              <option value="all">All</option>
              <option value="neg">Negative</option>
              <option value="neu">Neutral</option>
              <option value="pos">Positive</option>
            </select>
            <button onClick={handleTextAnalysis} className='nn'>Analyse Text</button>
          </div>
        </div>
        
        {renderTable()}
        
        {renderPieChart()}
        
      </div>
    </div>
  );
};


export default Twet;
