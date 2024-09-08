// import React, { useState } from 'react';
// import axios from 'axios';
// import Navigationn2 from '../components/navigation2'
// import Navigationn1 from '../components/navigation1';

// const You = () => {
// const [inputText, setInputText] = useState('');
// const [analysisResult, setAnalysisResult] = useState('');
// const handleTextAnalysis = async () => {
//     try {
//       // Make a POST request to your Flask server
//     const response = await axios.post('http://127.0.0.1:5000/you', {
//         product_name: inputText, // Change 'keyword' to 'text'
//     });

//       // Extract the analysis result from the response
//     const result = response.data.Results;
//     console.log(result);
//       // Set the analysis result in the state
//     setAnalysisResult(result);
//     } catch (error) {
//     console.error('Error while making the request:', error);
//       // Handle errors here
//     }
// };

//     return (
//       <div>
//       <Navigationn1/>
//     <h2>Text Analysis</h2>
//     <textarea
//         placeholder="Enter text for analysis..."
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//     />
//     <button onClick={handleTextAnalysis}>Analyse Text</button>
//     <table>
//           <thead>
//             <tr>
//               <th>SNO</th>
//               <th>Brand</th>
//               <th>Positive</th>
//               <th>Negative</th>
//               <th>Neutral</th>
//               <th>Polarity</th>
//               <th>Subjectivity</th>
//               <th>Score</th>
             
//             </tr>
//           </thead>
//           {/* <tbody>
//             {analysisResult.map((r, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{r.channel}</td>
//                 <td>{r.sentiment.positive}</td>
//                 <td>{r.sentiment.negative}</td>
//                 <td>{r.sentiment.neutral}</td>
//                 <td>{r.sentiment.polarity}</td>
//                 <td>{r.sentiment.subjectivity}</td>
//                 <td>{r.sentiment.score}</td>
                
//               </tr>
//             ))}
//           </tbody> */}
//         </table>
    
//     </div>
//     );
// };

// export default You;
import React, { useState } from 'react';
import axios from 'axios';
import Navigationn1 from '../components/navigation1';

const You = () => {
    const [inputText, setInputText] = useState('');
    const [analysisResult, setAnalysisResult] = useState([]);

    const handleTextAnalysis = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/you', {
                product_name: inputText,
            });

            const result = response.data.Results;
            setAnalysisResult(result);
        } catch (error) {
            console.error('Error while making the request:', error);
        }
    };

    return (
        <div>
            <Navigationn1 />
            <h2>Text Analysis</h2>
            <textarea
                placeholder="Enter text for analysis..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={handleTextAnalysis}>Analyse Text</button>
            <table>
                <thead>
                    <tr>
                        <th>SNO</th>
                        <th>Brand</th>
                        <th>Positive</th>
                        <th>Negative</th>
                        <th>Neutral</th>
                        <th>Polarity</th>
                        <th>Subjectivity</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {analysisResult.map((r, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{r.channel}</td>
                            <td>{r.sentiment.positive}</td>
                            <td>{r.sentiment.negative}</td>
                            <td>{r.sentiment.neutral}</td>
                            <td>{r.sentiment.polarity}</td>
                            <td>{r.sentiment.subjectivity}</td>
                            <td>{r.sentiment.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default You;
