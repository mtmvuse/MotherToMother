/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// TODO: REMOVE THIS DISABLE
import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import Badge from "@mui/material/Badge";

import ReviewSection from "../components/Form/ReviewSection";

const Profile: React.FC = () => {
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
        >
            <Typography variant="h3">Outgoing Donations</Typography>
            <Typography variant="body1">
                Select the categories and item types of resources that you would like to
                donate
            </Typography>

            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <NumberInCircle num={1} />
                <Typography variant="h5">Choose a category</Typography>
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <NumberInCircle num={2} />
                <Typography variant="h5">Review </Typography>
            </Stack>

            <ReviewSection />
        </Stack>
    );
};

function NumberInCircle({ num }: any) {
    return (
        <Badge
            badgeContent={num}
            color="primary"
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        ></Badge>
    );
}

export default Profile;
