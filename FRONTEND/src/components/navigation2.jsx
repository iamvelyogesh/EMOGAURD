import React from "react";
import { useNavigate } from 'react-router-dom';

export const Navigationn2 = (props) => {


  const navigate = useNavigate();

  const handleh = () => {
    // Use the navigate function to go to the "/anat" route
    navigate('/');
  };
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
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
          EMOGAURD PRO
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll" onClick={handletweet}>
                Whatsapp
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll" onClick={handlereddit}>
                Reddit
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll" onClick={handleyoutube}>
                Youtube
              </a>
            </li>
            {/* <li>
              <a href="#services" className="page-scroll" onClick={handlefacebook}>
                Facebook
              </a>
            </li> */}
            <li>
              <a href="#contact" className="page-scroll" onClick={handleh}>
                Go Back
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigationn2;
