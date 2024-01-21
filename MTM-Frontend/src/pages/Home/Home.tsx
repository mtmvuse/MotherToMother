import React, { useState } from "react";
import m2m_logo from "../../pages/assets/m2m_logo.png";
import "./Home.css";
import AccordionsLayout from "../../components/Accordions/AccordionsLayout";

const Home: React.FC = () => {
  const [showContact, setShowContact] = useState<boolean>(false);

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  return (
    <div className={"main-container"}>
      <div className={"logo-image"}>
        <img className="m2m_logo" src={m2m_logo} alt="m2m_logo" />
      </div>
      <div className="button-column">
        {showContact && (
          <div className="contact-popup">
            <div className="contact-content">
              <span className="close-btn" onClick={toggleContact}>
                &times;
              </span>
              <h2>Contact Us</h2>
              <h4>Phone</h4>
              <p>615-540-7000</p>
              <h4>Email</h4>
              <p>info@mothertomother.org</p>
              <h4>Address</h4>
              <p>478 Allied Drive Suite 104 & 105</p>
              <p>Nashville, TN 37211</p>
            </div>
          </div>
        )}
      </div>

      <AccordionsLayout />

      <div className="hours-container">
        <div className="hours-section">
          <h2>Warehouse Hours</h2>
          <p>Monday - Thursday: 1:00pm - 4:30pm</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
