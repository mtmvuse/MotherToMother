import NumberInCircle from "../ReviewSection/NumberInCircle";
import { NorthSharp } from "@mui/icons-material";
import {
  Typography,
  ThemeProvider,
  Grid,
  Stack,
  Box,
  CssBaseline,
  Container,
} from "@mui/material";
import { PrimaryMainTheme } from "../Theme";
import { question } from "./Questionaire";
import { QuestionField } from "./QuestionField";
import { useForm } from "../../../contexts/FormContext";

// Fields in the demographic details object. Corresponding to the questionaire, order matters
const demographicDetailFields: string[] = [
  "whiteNum",
  "blackNum",
  "latinoNum",
  "asianNum",
  "nativeNum",
  "otherNum",
];

const DemographicSection: React.FC = ({}) => {
  const { setDemographicDetails } = useForm();
  const handleInputChange = (event: React.FormEvent, index: number) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    const name = demographicDetailFields[index]!;
    setDemographicDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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
                <NumberInCircle
                  num={3}
                  color="var(--mtmGray)"
                  borderRaduis="50%"
                />
                <Typography
                  sx={{ typography: { xs: "h6" } }}
                  color="var(--mtmGray)"
                >
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
            sx={{
              backgroundColor: "#004A7C",
              borderRadius: "5px",
              height: "29px",
              display: "flex",
              marginTop: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <Typography color="white" alignSelf="center">
              Demographic Questionaire
            </Typography>
          </Container>

          <Grid
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
          >
            <Stack spacing={1}>
              {Object.entries(question).map(([question, value], i) => (
                <QuestionField
                  key={question}
                  question={question}
                  value={value}
                  onInputChange={(
                    event: React.FormEvent<Element> | undefined,
                  ) => {
                    if (event) {
                      handleInputChange(event, i);
                    }
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default DemographicSection;
