import { CssBaseline, ThemeProvider, Typography, Stack, Button, Box, Grid } from "@mui/material";
import { NorthSharp, SouthSharp } from '@mui/icons-material';
import { useState } from 'react';
import { PrimaryMainTheme } from "./Theme";
import NumberInCircle from "./NumberInCircle";

const buttonStyles = {
    button: {
        width: '100%',
        margin: '10px',
        height: '80px',
        padding: '20px',
        borderRadius: '20px',
        fontSize: '22px',
        color: '#333',
        borderColor: '#333',
    },
};

const GeneralSection = () => {
    return(
        <>
            <CssBaseline />
            <ThemeProvider theme={PrimaryMainTheme}>
                <Box width="85%">
                    <Grid container spacing={2} style={{marginTop: '5px'}}>
                        <Grid item xs={8}>
                            <Stack direction="row" spacing={1}>
                                <NumberInCircle num={1} borderRaduis="50%" />
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
                </Box>

                <Box width="95%">
                    <Grid>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Sleep </Button>
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Travel </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Bath & Changing </Button>
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Clothing </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Feeding </Button>
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Play </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Safety </Button>
                            <Button
                                style={buttonStyles.button}
                                fullWidth={true}
                                variant="outlined"
                            >Other </Button>
                        </Stack>
                    </Grid>
                </Box>                    
            </ThemeProvider>
        </>
    )
}

export default GeneralSection;