import React, { useState, useEffect } from "react";
import m2m_logo from "../../pages/assets/m2m_logo.png";
import m2m_animal from "../assets/animal_logo.png";
import "./Home.css";
import { AboutUsAccordion } from "../../components/Accordions/AboutUsAccordion";
import { ImpactAccordion } from "../../components/Accordions/ImpactAccordion";
import { ContactUsAccordion } from "../../components/Accordions/ContactUsAccordion";
import { DonateAccordion } from "../../components/Accordions/DonateAccordion";

const Home: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>("");
  const [userFirstName, setUserFirstName] = useState<string>("");

  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    if (firstName) {
      setUserFirstName(firstName);
    }
  }, []);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div className={"main-container"}>
      <div className={"logo-image"}>
        <img className="m2m_logo" src={m2m_logo} alt="m2m_logo" />
      </div>

      {!expanded && (
        <div>
          <h1 className="welcome-text">Welcome, {userFirstName || "Guest"}!</h1>
          <div className={"welcome-container"}>
            <p className="info-text">
              Give children in need the gift of health and wellness.
            </p>
            <img className="m2m_animal" src={m2m_animal} alt="m2m_animal" />
          </div>
        </div>
      )}
      <AboutUsAccordion expanded={expanded} handleChange={handleChange} />

      <ImpactAccordion expanded={expanded} handleChange={handleChange} />

      <ContactUsAccordion expanded={expanded} handleChange={handleChange} />

      <DonateAccordion expanded={expanded} handleChange={handleChange} />
    </div>
  );
};

export default Home;
