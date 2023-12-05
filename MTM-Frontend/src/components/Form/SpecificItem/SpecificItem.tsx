import React from "react";
import "./SpecificItem.css";
import { CssBaseline, ThemeProvider, Button, Box } from "@mui/material";
import { PrimaryMainTheme } from "../Theme";

const buttonStyles = {
  button: {
    width: "90%",
    margin: "8px",
    height: "60px",
    paddingTop: "20px",
    paddingBottom: "20px",
    weight: "400",
    borderRadius: "10px",
    border: "outlined",
    fontSize: "18px",
    color: "#333",
    borderColor: "#333",
  },
};

interface SpecificItemProps {
  categoryName: string;
  productNames: string[];
}

const SpecificItem: React.FC<SpecificItemProps> = ({
  categoryName,
  productNames,
}) => {
  return (
    <div className="category-container">
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <h1 className="category-name">{categoryName}</h1>
        <Box width="100%" marginBottom="80px">
          <div className="product-list">
            {productNames.map((productName, index) => (
              <Button
                key={index}
                style={buttonStyles.button}
                variant="outlined"
              >
                {productName}
              </Button>
            ))}
          </div>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default SpecificItem;
