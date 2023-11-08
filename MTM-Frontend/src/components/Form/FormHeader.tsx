import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Stack,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { NorthSharp, SouthSharp } from "@mui/icons-material";
import NumberInCircle from "./NumberInCircle";

interface FormHeaderNum {
  number: number;
}

const FormHeader: React.FC<FormHeaderNum> = (num) => {
  return (
    <Grid container spacing={2} style={{ marginTop: "5px" }}>
      <Grid item xs={8}>
        <Stack direction="row" spacing={1}>
          <NumberInCircle num={num.number} borderRaduis="50%" />
          <Typography variant="h6">Review </Typography>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <NorthSharp sx={{ fontSize: 30 }} color="primary" />
          <SouthSharp sx={{ fontSize: 30 }} color="primary" />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FormHeader;
