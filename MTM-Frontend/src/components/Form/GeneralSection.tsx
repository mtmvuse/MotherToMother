import React, { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Button,
  Box,
  Grid,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { PrimaryMainTheme } from "./Theme";
import FormHeader from "./FormHeader";
import { useLocation, useNavigate } from "react-router-dom";

// the rows for each button on the form page
const BroadCategories = {
  row1: ["Travel", "Sleep"],
  row2: ["Bath & Changing", "Clothing"],
  row3: ["Feeding", "Play"],
  row4: ["Safety", "Other"],
} as const;

// used to map the appropriate broad category
// to the specific items array
const ProductNames = {
  Travel: [],
  Sleep: [],
  "Bath & Changing": [],
  Clothing: [],
  Feeding: [],
  Play: [],
  Safety: [],
  Other: [],
} as const;

const buttonStyles = {
  width: "100%",
  margin: "10px",
  height: "80px",
  borderRadius: "20px",
  border: "outlined",
  fontSize: "22px",
  color: "#333",
  borderColor: "#333",
} as const;

const getBottomNavActionValue = (category: string) =>
  `/home/form/specificItem?category=${encodeURIComponent(
    category,
  )}&products=${encodeURIComponent(JSON.stringify(ProductNames[category]))}`;

interface CategoryGenProps {
  rowName: string[];
}

const CategoryGen: React.FC<CategoryGenProps> = ({ rowName }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (index: number) => {
    setSelectedIndex(index);
    const categoryName = rowName[index];
    navigate(getBottomNavActionValue(categoryName));
  };

  return (
    <Box width="90%">
      <Grid>
        <Stack direction="row" spacing={2}>
          {rowName.map((category, index) => (
            <Button
              key={index}
              style={buttonStyles}
              fullWidth={true}
              variant="outlined"
              onClick={() => handleClick(index)}
            >
              {category}
            </Button>
          ))}
        </Stack>
      </Grid>
      {selectedIndex !== null && ProductNames[rowName[selectedIndex]] && (
        <BottomNavigation
          showLabels
          value={location.pathname}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
        >
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={getBottomNavActionValue(rowName[selectedIndex])}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

interface GeneralSectionProps {
  step: number;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ step }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <Box width="85%">
          <FormHeader number={step} header="Choose a category" />
        </Box>
        {Object.values(BroadCategories).map((rowName, index) => (
          <CategoryGen key={index} rowName={rowName} />
        ))}
      </ThemeProvider>
    </>
  );
};

export default GeneralSection;
