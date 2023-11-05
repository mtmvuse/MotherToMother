import React from "react";
import Box from '@mui/material/Box';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import "./Navbar.css"
import { useNavigate } from "react-router-dom";


export const Navbar: React.FC = () => {
    const [value, setValue] = React.useState("");
    const navigate = useNavigate();
    return (
        <div className="BottomNavbar">
            <Box>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {setValue(newValue); navigate(newValue)}}
                >
                    <BottomNavigationAction sx={{ flexGrow: 1 }} value={"/home"} icon={<HomeIcon/>}/>
                    <BottomNavigationAction sx={{ flexGrow: 1 }} value={"/home/profile"} icon={<PersonIcon/>}/>
                    <BottomNavigationAction sx={{ flexGrow: 1 }} value={"/home/form"} icon={<ChildFriendlyIcon/>}/>
                </BottomNavigation>
            </Box>
        </div>
    ); 
};

export default Navbar