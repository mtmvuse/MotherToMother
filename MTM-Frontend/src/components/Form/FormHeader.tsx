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

interface FormHeaderText {
  header: string;
}

interface UpArrow {
  north: boolean;
}

type props = FormHeaderNum | FormHeaderText | UpArrow;

const FormHeader: React.FC<props> = (props) => {
  const { number } = props as FormHeaderNum;
  const { header } = props as FormHeaderText;
  const { north } = props as UpArrow;
  return (
    <Grid container spacing={2} style={{ marginTop: "5px" }}>
      <Grid item xs={8}>
        <Stack direction="row" spacing={1}>
          <span>
            <NumberInCircle num={number} borderRaduis="50%" />
          </span>
          <Typography variant="h6" fontSize={"18px"} whiteSpace={"nowrap"}>
            {header}
          </Typography>
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
