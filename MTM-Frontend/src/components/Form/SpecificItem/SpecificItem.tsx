import React from 'react';
import './SpecificItem.css';
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Stack,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { PrimaryMainTheme } from "../Theme";

const buttonStyles = {
  button: {
    width: "170%",
    margin: "10px",
    height: "60px",
    padding: "20px",
    borderRadius: "10px",
    border: "outlined",
    fontSize: "22px",
    color: "#333",
    borderColor: "#333"
  },
};

interface SpecificItemProps {
  categoryName: string;
  productNames: string[];
}

const SpecificItem: React.FC<SpecificItemProps> = ({ categoryName, productNames }) => {
  return (
    <div className="category-container">
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
      <h1 className="category-name">{categoryName}</h1>
      <div className="product-list">
        {productNames.map((productName, index) => (
          <Button
          key={index}
          style={buttonStyles.button}
          fullWidth={true}
          variant="outlined"
        >
            {productName}
          </Button>
        ))}
      </div>
      </ThemeProvider>
      
    </div>
  );
};

export default SpecificItem;
