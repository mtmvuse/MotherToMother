import { CssBaseline, ThemeProvider, Typography, Stack, Button, Box, Grid } from "@mui/material";
import { NorthSharp, SouthSharp } from '@mui/icons-material';
import { useState } from 'react';
import { PrimaryMainTheme } from "./Theme";
import { items, itemType } from "./Items";
import { Category } from "./Category";
import { isSubCategoryNotEmpty } from "./SubCategory"
import NumberInCircle from "./NumberInCircle";

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
    const [editMode, setEditMode] = useState(false);

    const handleEdit = () => {
        setEditMode(true);
    }

    const handleSave = () => {
        setEditMode(false);
        // TODO: Save the changes to the database
    }

    const handleCancel = () => {
        setEditMode(false);
    }

    return (
        <>
            <CssBaseline />
            <ThemeProvider theme={PrimaryMainTheme}>
                <Box width="85%">
                    {/* Header of Review Section */}
                    <Grid container spacing={2} style={{marginTop: '5px', marginBottom: '20px' }}>
                        <Grid item xs={8}>
                            <Stack direction="row" spacing={1}>
                                <NumberInCircle num={2} borderRaduis="50%" />
                                <Typography variant="h6" >Review </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <NorthSharp sx={{ fontSize: 30 }} color="primary" />
                                <SouthSharp sx={{ fontSize: 30 }} color="primary" />
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Main Content of Review Section */}
                    <Stack direction="row" spacing={1} marginY="10px" justifyContent="center">
                        <NumberInCircle num={getSubCategoryCount()} backgroundColor="#6D6D6D" color="white" borderRaduis="10px" width="50px" height="28px" borderWidth="0" />
                        <Typography variant="body1"> items are in your form </Typography>
                    </Stack>
                    {Object.keys(items).map((category) => (
                        <Category key={category} categoryName={category} editMode={editMode} />
                    ))}
                </Box>
                {!editMode && <Button variant="outlined" sx={{ fontSize: 15 }} onClick={handleEdit} style={{marginBottom: '80px' }}>Edit</Button>}
                {editMode &&
                    <Stack direction="row" spacing={3}>
                        <Button variant="contained" sx={{ fontSize: 15, height: "33px" }} color="primary" onClick={handleSave} style={{marginBottom: '80px' }}>Save</Button>
                        <Button variant="outlined" sx={{ fontSize: 15, height: "33px" }} onClick={handleCancel}>Cancel</Button>
                    </Stack>}
            </ThemeProvider>
        </>
    )
}

export default ReviewSection;