import React, { useState } from "react";
import m2m_logo from "../../pages/assets/m2m_logo.png";
import "./Home.css";
import { AboutUsAccordion } from "../../components/Accordions/AboutUsAccordion";
import { ImpactAccordion } from "../../components/Accordions/ImpactAccordion";
import { ContactUsAccordion } from "../../components/Accordions/ContactUsAccordion";
import { DonateAccordion } from "../../components/Accordions/DonateAccordion";

const Home: React.FC = () => {
  const [showContact, setShowContact] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>("");

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
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

      <AboutUsAccordion expanded={expanded} handleChange={handleChange} />

      <ImpactAccordion expanded={expanded} handleChange={handleChange} />

      <ContactUsAccordion expanded={expanded} handleChange={handleChange} />

      <DonateAccordion expanded={expanded} handleChange={handleChange} />
    </div>
  );
};

export default Home;
