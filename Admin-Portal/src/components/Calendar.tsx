import React, { useState } from 'react';
import { CalendarIcon } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import type { Range } from 'react-date-range';
import { GridFilterModel } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, Dialog, DialogContent, Typography, Box } from '@mui/material';
import { ImportContacts } from '@mui/icons-material';

interface CalendarProps {
	setFilterModel: React.Dispatch<React.SetStateAction<GridFilterModel | undefined>>;
}

const Calendar: React.FC<CalendarProps> = ({ setFilterModel }) => {
	const [openCal, setOpenCal] = useState(false);
	const [date, setDate] = useState<Range[] | null>(null);

	// ([
	// 	{
	// 		startDate: new Date(),
	// 		endDate: new Date(),
	// 		key: 'selection',
	// 	},
	// ]);

	const handleCalendarOpen = () => {
		setOpenCal(true);
	};

	const handleCalendarClose = () => {
		setOpenCal(false);
	};

	const handleClearDateFilter = () => {
		setDate(null);
		setFilterModel(undefined);
	};
	const handleDateChange = (ranges: any) => {
		const filter = [
			{
				field: 'date',
				operator: '<=',
				value: new Date(
					new Date(ranges.selection.endDate).setDate(new Date(ranges.selection.endDate).getDate() + 1)
				).toISOString(),
			},
			{
				field: 'date',
				operator: '>=',
				value: ranges.selection.startDate.toISOString(),
			},
		];
		setDate([ranges.selection]);
		console.log([ranges.selection]);
		setFilterModel({ items: filter });
	};

	return (
		<>
			<Box className='calendar-container'>
				<Button className='table-add-calendar-button' onClick={handleCalendarOpen} endIcon={<CalendarIcon />}>
					Choose Date
				</Button>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Dialog open={openCal} onClose={handleCalendarClose} maxWidth={false}>
						<DialogContent>
							<DateRangePicker
								onChange={handleDateChange}
								moveRangeOnFirstSelection={false}
								months={2}
								ranges={
									date || [
										{
											startDate: new Date(),
											endDate: new Date(),
											key: 'selection',
										},
									]
								}
								direction='horizontal'
								rangeColors={['#4DAD45']}
							/>
						</DialogContent>
					</Dialog>
				</LocalizationProvider>
				{date && (
					<Box className='calendar-date-range-container'>
						<Typography className='calendar-date-range-text'>
							{date[0]?.startDate?.toDateString()} - {date[0]?.endDate?.toDateString()}
							<IconButton onClick={handleClearDateFilter} aria-label='clear-date-filter' style={{ color: 'lightgray' }}>
								<CancelIcon />
							</IconButton>
						</Typography>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Calendar;
