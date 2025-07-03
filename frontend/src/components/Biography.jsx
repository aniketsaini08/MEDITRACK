import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
          Our current project focuses on developing an advanced application . 
          This project aims to provide seamless user experience, robust back-end functionality, and effective database management.
          </p>
          <p>We are excited to bring innovative features and cutting-edge solutions as part of our 2024 project lineup!</p>
          <p>The primary goal is to create an interactive and scalable platform that can handle real-time data while ensuring efficiency and security. 
          Our team is dedicated to achieving excellence through continuous learning and problem-solving.</p>
          <p>
          Through collaborative efforts and a passion for coding, we are overcoming challenges and driving the project towards completion.
          Each line of code contributes to a robust and reliable solution.
          </p>
          <p>Building this project has not only enhanced our technical skills but also shown us how coding can be both fun and impactful!</p>
          <p>Exciting things are on the way!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
