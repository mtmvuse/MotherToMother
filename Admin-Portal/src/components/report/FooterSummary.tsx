import React from 'react';
import { Typography, Box } from '@mui/material';

interface FooterSummaryProps {
	totalQuantity: number;
	totalValue: number;
}

const FooterSummary: React.FC<FooterSummaryProps> = ({ totalQuantity, totalValue }) => {
	return (
		<>
			<Box className='footer-summary' display='flex' justifyContent='justify-between'>
				<Box className='footer-summary-header' paddingLeft={3} marginTop='5px'>
					<Typography>Total Quantity</Typography>
					<Typography color='black'>{totalQuantity}</Typography>
				</Box>
				<Box className='footer-summary-header' paddingRight={3} marginTop='5px'>
					<Typography>Total Value</Typography>
					<Typography color='black'>${totalValue}</Typography>
				</Box>
			</Box>
		</>
	);
};

export default FooterSummary;
