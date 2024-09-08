// import React from "react";

// import { useNavigate } from 'react-router-dom';

// export const Features = (props) => {

  // const navigate = useNavigate();

  // const handletxt = () => {
  //   // Use the navigate function to go to the "/text" route
  //   navigate('/text');
  // };

  // const handleaud = () => {
  //   // Use the navigate function to go to the "/audio" route
  //   navigate('/audio');
  // };

  // const handleimg = () => {
  //   // Use the navigate function to go to the "/img" route
  //   navigate('/img');
  // };

  // const handlevdo = () => {
  //   // Use the navigate function to go to the "/vdo" route
  //   navigate('/vdo');
  // };

//   return (
//     <div id="features" className="text-center">
//       <div className="container">
//         <div className="col-md-10 col-md-offset-1 section-title">
//           <h2>Features</h2>
//         </div>
//         <div className="row">
//           {props.data
//             ? props.data.map((d, i) => (
//                 <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
//                   {" "}
//                   {/* <i className={d.icon}></i>
//                   <h3>{d.title}</h3>
//                   <p>{d.text}</p>
//                 </div> */}
//                   <i className={d.icon}></i>
//                   <h3>{d.title}</h3>
//                   <p>{d.text}</p>
//                   {/* Attach the appropriate onClick handler based on the feature */}
//                   {d.title === "Twitter Analysis" && <button onClick={handletxt}>Click me</button>}
//                   {d.title === "Youtube" && <button onClick={handleaud}>Click me</button>}
//                   {d.title === "Reddit Analysis" && <button onClick={handleimg}>Click me</button>}
//                   {d.title === "Facebook Analysis" && <button onClick={handlevdo}>Click me</button>}
//                 </div>
//               ))
//             : "Loading..."}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect } from "react";
import './Ana.css';
import { useNavigate } from 'react-router-dom';
import a from '../images/images/as.jpeg'

import r from '../images/images/r.png';
import x from '../images/images/y.png';
import ss from '../images/images/ss.png';
export const Fet = () => {

  const navigate = useNavigate();

  const handletweet = () => {
    // Use the navigate function to go to the "/anat" route
    navigate('/sus');
  };
  const handlereddit = () => {
    // Use the navigate function to go to the "/anat" route
    navigate('/reddit');
  };
  const handleyoutube = () => {
    // Use the navigate function to go to the "/anat" route
    navigate('/youtube');
  };
  const handlefacebook = () => {
    // Use the navigate function to go to the "/anat" route
    navigate('/facebook');
  };
  return (
  <div className="s" id="features">
    <div>
    <div className="row">
                  <div className="p" >
                    <div className="main-title text-center wow fadeIn">
                      <h3>What we do</h3>
                      <div className="underline1"></div>
                      <div className="underline2"></div>
                      <p>
                      Discover a transformative experience on our website as we employ advanced sentiment analysis to predict your emotions across dynamic inputs such as text, voice, images, videos, and tweets. Uncover insights into your sentiments with unparalleled accuracy and real-time analysis. From the written word to spoken language and visual content, our platform provides a comprehensive view of your emotional expressions. Join us in exploring the intricate layers of sentiment prediction through a seamless, user-friendly interface. Elevate your understanding of emotions with our all-encompassing sentiment analysis capabilities.
                      </p>
                    </div>
                  </div>
                </div>
    </div>
    <div className="a">
     <div id="card">
     <img id="avatar" src={ss} alt="avatar" />
  <div id="info">
    <p id="name">WhatsApp
  Analysis</p>
    <p id="activity">Lets hear your Sentiments</p>
    <button id="btn" onClick={handletweet}>Go</button>
  </div>

  </div>
    <div id="card1">
    <img id="avatar" src={r } alt="avatar" />
    <div id="info">
      <p id="name">Reddit Analysis</p>
      <p id="activity">Lets extract image Sentiments</p>
      <button id="btn"  onClick={handlereddit}>Go</button>
    </div>
  </div>
  <div id="card1">
    <img id="avatar" src={x} alt="avatar" />
    <div id="info">
      <p id="name">Youtube Analysis</p>
      <p id="activity">Lets extract Video Sentiments</p>
      <button id="btn" onClick={handleyoutube} >Go</button>
    </div>
  </div>
  {/* <div id="card1">
  <  img id="avatar" src={b} alt="insta" />
    <div id="info">
      <p id="name">Analyse Facebook</p>
      <p id="activity">Lets extract tweet Sentiments</p>
      <button id="btn" onClick={handlefacebook}>Go</button>
    </div>
  </div> */}
</div>
</div>
  );
};

// export default Fet;



