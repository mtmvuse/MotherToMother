import React from "react";
import { Typography, Box } from "@mui/material";

interface FooterSummaryProps {
  totalAmount: number;
  totalValue: number;
}

const FooterSummary: React.FC<FooterSummaryProps> = ({
  totalAmount,
  totalValue,
}) => {
  return (
    <>
      <Box
        className="footer-summary"
        display="flex"
        justifyContent="justify-between"
      >
        <Box className="footer-summary-header" paddingLeft={3} marginTop="5px">
          <Typography>Total Amount</Typography>
          <Typography color="black">{totalAmount}</Typography>
        </Box>
        <Box className="footer-summary-header" paddingRight={3} marginTop="5px">
          <Typography>Total Value</Typography>
          <Typography color="black">${totalValue}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default FooterSummary;
