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
import FormHeader from "../FormHeader";

interface DemographicSectionProps {
  currPanel: string;
  setCurrPanel: React.Dispatch<React.SetStateAction<string>>;
}

// Fields in the demographic details object. Corresponding to the questionaire, order matters
const demographicDetailFields: string[] = [
  "whiteNum",
  "blackNum",
  "latinoNum",
  "asianNum",
  "nativeNum",
  "otherNum",
];

const DemographicSection: React.FC<DemographicSectionProps> = ({
  currPanel,
  setCurrPanel,
}) => {
  const { setDemographicDetails } = useForm();

  const handlePanelChange = () => {
    setCurrPanel("DemographicSection");
  };

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
        <Box width="100%">
          <Box width="100%" onClick={handlePanelChange}>
            {/* Header of Demographic Section */}
            <FormHeader number={3} header="Demographic Details" />
          </Box>
          {/* Main Content of Demographic Section */}
          {currPanel === "DemographicSection" && (
            <>
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
            </>
          )}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default DemographicSection;
