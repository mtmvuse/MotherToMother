import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import animal_logo from "../pages/assets/success.png";
import "./Success.css";

const Success: React.FC = () => {
  return (
    <div className="Success-container">
      <div className="animal-logo">
        <img src={animal_logo} alt="Image1" />
      </div>
      <h1 className="h1-custom">Success!</h1>
      <h2 className="h2-custom">Your donation form has been received <br /> and it will help others!</h2>
      <Typography>
        <Link to="/home/form" className={"link-bold"}>
          start new form
        </Link>
      </Typography>
    </div>
  );
};

export default Success;
