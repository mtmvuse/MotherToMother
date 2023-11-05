import { createTheme } from "@mui/material/styles";

const PrimaryMainTheme = createTheme({
    palette: {
        primary: {
            main: "#A4A4A4",
        },
        secondary: {
            main: "#6D6D6D",
        },

    },
    typography: {
        button: {
            textTransform: 'none'
        },
    }
});

export { PrimaryMainTheme };
