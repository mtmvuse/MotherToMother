import React, { useState } from "react";
import "./SpecificItem.css";
import { CssBaseline, ThemeProvider, Button, Box } from "@mui/material";
import { PrimaryMainTheme } from "../Theme";
import { SpecificItemsDialog } from "../SpecificItemsDialog";

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
  category: string;
  items: string[];
}

const SpecificItem: React.FC<SpecificItemProps> = ({ category, items }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [curItem, setCurItem] = useState("");
  const onItemClick = (item: string) => {
    setCurItem(item);
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setCurItem("");
    setOpenDialog(false);
  };
  return (
    <div className="category-container">
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <h1 className="category-name">{category}</h1>
        <Box width="100%" marginBottom="80px">
          <div className="product-list">
            {items.map((item, index) => (
              <Button
                key={index}
                style={buttonStyles.button}
                variant="outlined"
                onClick={() => onItemClick(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </Box>
        <SpecificItemsDialog
          open={openDialog}
          onClose={onCloseDialog}
          donationDetail={{
            category: category,
            item: curItem,
            newQuantity: 0,
            usedQuantity: 0,
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default SpecificItem;
