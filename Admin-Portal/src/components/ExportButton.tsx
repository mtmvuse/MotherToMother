import React from 'react';
import { Button, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

interface ExportButtonProps {
	handleExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ handleExport }) => {
	return (
		<Button
			onClick={handleExport}
			variant='contained'
			sx={{ margin: 'auto 10px 10px auto' }}
			className='table-add-export-button'
		>
			<DownloadOutlinedIcon sx={{ marginRight: '6px' }} />
			<Typography sx={{ textTransform: 'capitalize', fontSize: '18px' }}>Export</Typography>
		</Button>
	);
};

export default ExportButton;
