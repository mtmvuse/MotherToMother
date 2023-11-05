import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { items, itemType } from "./Items";
import { SubCategory } from "./SubCategory"

type categoryType = {
    [key: string]: [number, number];
};

const getCategories = (category: string) => {
    if (isCategoryNotEmpty(items[category] as itemType[string])) {
        return <Box key={category}>
            <Container key={category} sx={{ backgroundColor: 'primary.main', borderRadius: "5px", height: "29px", display: "flex" }}>
                <Typography color="white" alignSelf="center">  {category}</Typography>
            </Container>

            <Grid container alignItems="center" justifyContent="center">
                {Object.keys(items[category] as itemType[string]).map((subCategory) => (
                    SubCategory({ subCategoryName: subCategory, subCategoryValues: items[category]![subCategory]! })
                ))}
            </Grid>
        </Box>
    }
    return <div></div>
}

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
}

const Category = (props: CategoryProps) => {
    return (
        getCategories(props.categoryName)
    )
};

export { Category }