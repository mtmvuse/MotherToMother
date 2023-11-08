import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Stack,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { PrimaryMainTheme } from "./Theme";
import FormHeader from "./FormHeader";

const buttonStyles = {
  button: {
    width: "100%",
    margin: "10px",
    height: "80px",
    padding: "20px",
    borderRadius: "20px",
    border: "outlined",
    fontSize: "22px",
    color: "#333",
    borderColor: "#333",
  },
};

const buttonRows: Record<string, string[]> = {
  row1: ["Travel", "Sleep"],
  row2: ["Bath & Changing", "Clothing"],
  row3: ["Feeding", "Play"],
  row4: ["Safety", "Other"],
};

interface CategoryGenProps {
  rowName: string[];
}

function CategoryGen(props: CategoryGenProps) {
  return (
    <Box width="95%" justifyContent="align-items">
      <Grid>
        <Stack direction="row" spacing={2}>
          <Button
            style={buttonStyles.button}
            fullWidth={true}
            variant="outlined"
          >
            {props.rowName[0]}
          </Button>
          <Button
            style={buttonStyles.button}
            fullWidth={true}
            variant="outlined"
          >
            {props.rowName[1]}
          </Button>
        </Stack>
      </Grid>
    </Box>
  );
}

const GeneralSection = () => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <Box width="85%">
          <FormHeader number={1} />
        </Box>
        {Object.keys(buttonRows).map((category) => (
          <CategoryGen key={category} rowName={buttonRows[category]!} />
        ))}
      </ThemeProvider>
    </>
  );
};

export default GeneralSection;
