import React from "react";
import { useNavigate } from 'react-router-dom';

export const Services = (props) => {

    const navigate = useNavigate();
  
    const handleNavigation = (route) => {
      navigate(route);
    };

  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
           EMOGUARD PRO IS A PLATFORM , IT CAN ANALYSE THE SOCIAL MEDIA HANDLE OF INDIVIDUALS
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4" >
                  {" "}
                  <i className={d.icon} onClick={() => handleNavigation(`/${d.route}`)}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
