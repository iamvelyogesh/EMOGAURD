import React, { useState, useEffect } from "react";
import { Navigationn } from "./components/navigation";
import { Header } from "./components/header";
import { Fet } from "./components/Features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import You from "./componentsjs/You";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Appp = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigationn />
      <Header data={landingPageData.Header} />
      <Fet data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      {/* <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} /> */}
      <Contact data={landingPageData.Contact} />
      
    </div>
  );
};

export default Appp;
