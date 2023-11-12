import NumberInCircle from "./NumberInCircle";
import { NorthSharp } from "@mui/icons-material";
import {
  Typography,
  ThemeProvider,
  Grid,
  Stack,
  Box,
  CssBaseline,
  Container,
  Button,
} from "@mui/material";
import { PrimaryMainTheme } from "./Theme";
import { question, questionType } from "./Questionaire";
import { QuestionField } from "./QuestionField";

const DemographicSection: React.FC = () => {
  const handleInputChange = (event: any) => {
    event.preventDefault();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // information is in event.target[i].value from 0-4
    // 0 : White , 1: Black , 2: Latino , 3: Asian , 4: Native American
    console.log("handleSubmit API");
  };
  const handleSave = (event: any) => {
    console.log("handleSave API");
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <Box width="85%">
          {/* Header of Demographic Section */}
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Stack direction="row" spacing={1}>
                <NumberInCircle num={3} borderRaduis="50%" />
                <Typography sx={{ typography: { xs: "h6" } }}>
                  Save and Submit{" "}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <NorthSharp sx={{ fontSize: 30 }} color="primary" />
              </Stack>
            </Grid>
          </Grid>
          {/* Main Content of Demographic Section */}
          <Container
            className="mb-3"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "5px",
              height: "29px",
              display: "flex",
              marginTop: "1rem",
            }}
          >
            <Typography color="white" alignSelf="center">
              Demographic Questionaire
            </Typography>
          </Container>

          <form onSubmit={handleSubmit}>
            <Grid
              alignItems="center"
              justifyContent="space-between"
              marginBottom={2}
            >
              <Stack spacing={1}>
                {Object.entries(question).map(([question, value]) => (
                  <QuestionField
                    question={question}
                    value={value}
                    onInputChange={handleInputChange}
                  />
                ))}
              </Stack>
            </Grid>
            <Stack justifyContent="center" direction="row" spacing={3}>
              <Button type="submit" variant="outlined" sx={{ fontSize: 15 }}>
                Submit
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                variant="outlined"
                sx={{ fontSize: 15 }}
              >
                Save
              </Button>
            </Stack>
          </form>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default DemographicSection;
