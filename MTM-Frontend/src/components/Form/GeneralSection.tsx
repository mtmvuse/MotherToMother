import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Button,
  Box,
  Grid,
  Stack,
  CircularProgress,
} from "@mui/material";
import { PrimaryMainTheme } from "./Theme";
import FormHeader from "./FormHeader";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../../lib/services";
import { ItemResponse } from "../../types/FormTypes";
import { useAuth } from "../../contexts/AuthContext";
import { ErrorMessage } from "../../components/Error";

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
  `/home/form/specificItem?category=${encodeURIComponent(category)}`;

interface CategoryGenProps {
  broadCategories: string[];
}

const CategoryGen: React.FC<CategoryGenProps> = ({ broadCategories }) => {
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    const categoryName = broadCategories[index]!;
    navigate(getBottomNavActionValue(categoryName));
  };

  return (
    <Box width="90%">
      <Grid>
        <Stack direction="row" spacing={2}>
          {broadCategories.map((category, index) => (
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
    </Box>
  );
};

interface GeneralSectionProps {
  step: number;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ step }) => {
  const { logout, currentUser } = useAuth();
  const [broadCategories, setBroadCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!currentUser) {
          throw new Error("Current user not found");
        }
        console.log("a");

        const token = await currentUser.getIdToken();
        console.log("b");

        const response = await getAllItems(token);
        console.log(response);
        if (!response.ok) {
          throw new Error("Error fetching items");
        }

        console.log(response);
        const itemsData = (await response.json()) as ItemResponse[];
        setBroadCategories(
          Array.from(
            new Set(itemsData.map((item: ItemResponse) => item.category)),
          ),
        );
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <Box width="85%">
          <FormHeader number={step} header="Choose a category" />
        </Box>

        <ErrorMessage error={error} setError={setError} />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CategoryGen broadCategories={broadCategories} />
        )}
      </ThemeProvider>
    </>
  );
};

export default GeneralSection;
