import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData } from "../../lib/services";
import type { UserType } from "../../types/UserTypes";
import m2m_logo from "../../pages/assets/m2m_logo.png";
import m2m_animal from "../assets/animal_logo.png";
import "./Home.css";
import { AboutUsAccordion } from "../../components/Accordions/AboutUsAccordion";
import { ImpactAccordion } from "../../components/Accordions/ImpactAccordion";
import { ContactUsAccordion } from "../../components/Accordions/ContactUsAccordion";
import { DonateAccordion } from "../../components/Accordions/DonateAccordion";

const Home: React.FC = () => {
  const [showContact, setShowContact] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>("");

  const [user, setUser] = useState<UserType | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser) {
          throw new Error("Current user not found");
        }
        const token = await currentUser.getIdToken();

        const userEmail = currentUser.email;
        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await getUserData(userEmail, token);
        if (!response.ok) {
          throw new Error("Error fetching user");
        }

        const userData = (await response.json()) as UserType;
        setUser(userData);
      } catch (error) {
        const err = error as Error;
      }
    };

    fetchUser();
  }, []);

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

      {!expanded && (
        <div>
          <h1 className="welcome-text">Welcome, {user?.firstName}!</h1>
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
