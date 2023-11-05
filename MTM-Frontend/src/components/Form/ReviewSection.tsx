import { Container, CssBaseline, ThemeProvider, Typography, Stack, Button, Box, Grid } from "@mui/material";
import { PrimaryMainTheme } from "./Theme";
import { items, itemType } from "./Items";
import { Category } from "./Category";
import { isSubCategoryNotEmpty } from "./SubCategory"

const getSubCategoryCount = () => {
    let count = 0;
    for (const category in items) {
        for (const subCategory in items[category]) {
            if (isSubCategoryNotEmpty(items[category]![subCategory]!)) {
                count++;
            }
        }
    }
    return count;
}

const ReviewSection = () => {
    return (
        <>
            <CssBaseline />
            <ThemeProvider theme={PrimaryMainTheme}>
                <Box width="85%">
                    <div> {getSubCategoryCount()} items are in your form </div>
                    {Object.keys(items).map((category) => (
                        <Category key={category} categoryName={category} />
                    ))}
                </Box>
                <Button variant="contained" color="secondary">Edit</Button>
            </ThemeProvider>

        </>

    );
}

export default ReviewSection;