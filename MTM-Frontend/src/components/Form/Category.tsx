import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { items, itemType } from "./Items";
import { SubCategory } from "./SubCategory";

type categoryType = {
  [key: string]: [number, number];
};

const getCategories = (category: string, editMode: boolean) => {
  if (isCategoryNotEmpty(items[category] as itemType[string])) {
    return (
      <Box key={category}>
        <Container
          key={category}
          sx={{
            backgroundColor: "primary.main",
            borderRadius: "5px",
            height: "29px",
            display: "flex",
          }}
        >
          <Typography color="white" alignSelf="center">
            {" "}
            {category}
          </Typography>
        </Container>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {Object.keys(items[category] as itemType[string]).map(
            (subCategory) => (
              <SubCategory
                key={subCategory}
                category={category}
                subCategoryName={subCategory}
                subCategoryValues={items[category]![subCategory]!}
                editMode={editMode}
              />
            ),
          )}
        </Stack>
      </Box>
    );
  }
  return <div></div>;
};

const isCategoryNotEmpty = (category: categoryType) => {
  for (const key in category) {
    if (category[key]![0] !== 0 || category[key]![1] !== 0) {
      return true;
    }
  }
  return false;
};

type CategoryProps = {
  categoryName: string;
  editMode: boolean;
};

const Category = (props: CategoryProps) => {
  return getCategories(props.categoryName, props.editMode);
};

export { Category };
