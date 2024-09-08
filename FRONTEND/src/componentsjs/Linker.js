import React, { useState } from 'react';
import './YourComponent.css'; // Import your CSS file
// import { TextField } from '@mui/material';
import head from '../images/head.gif';
const Youtube = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container80">

      <div className="form-container80 sign-up-container80">
        <form action="#">
        
        <img src={head} alt="Description of the image" className='aa'/>
          <h2 className='.h2'>Brands Analysing</h2>
    <br></br>
    <input
          label="Let's Analyse your opinions"
          id="outlined-size-small"
      
          size="small"
        />
        <br></br><br></br>
          <button>submit</button>
        </form>
      </div>
      <div className="form-container80 sign-in-container80">
        <form action="#">
          <h2 className='.h2'>Analysing Perspective of Public </h2>
          <input
          label="Let's Analyse your opinions"
          id="outlined-size-small"
  
          size="small"
        />
    <br></br>
          <button>View Result</button>
        </form>
      </div>
      <div className="overlay-container80">
        <div className="overlay80">
          <div className="overlay-panel80 overlay-left80">
            <h1 className='.h1'>Perspective Analysing</h1>
            <p>To understand the public perspetive about specific topic</p>
            <button className="ghost" onClick={handleSignInClick}>Let's Analyse</button>
          </div>
          <div className="overlay-panel80 overlay-right80">
            <h1 className='.h1'>Analysing Top Brands</h1>
            <p>Let's Analyse Top 3 brands in Youtube by comments of people</p>
            <button className="ghost" onClick={handleSignUpClick}>Let's Analyse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Youtube;