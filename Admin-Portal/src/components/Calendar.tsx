import React, { useEffect, useState, useRef } from 'react';
import { CalendarIcon } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import type { Range } from 'react-date-range';
import { GridFilterModel } from '@mui/x-data-grid';
import { Button, Dialog, DialogContent } from '@mui/material';

interface CalendarProps {
	setFilterModel: React.Dispatch<React.SetStateAction<GridFilterModel | undefined>>;
}

const Calendar: React.FC<CalendarProps> = ({ setFilterModel }) => {
	console.log('changed');
	const [openCal, setOpenCal] = useState(false);
	const [date, setDate] = useState<Range[]>([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]);

	const handleCalendarOpen = () => {
		setOpenCal(true);
	};

	const handleCalendarClose = () => {
		setOpenCal(false);
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
		setFilterModel({ items: filter });
		console.log(filter);
	};

	return (
		<>
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
							ranges={date}
							direction='horizontal'
							rangeColors={['#4DAD45']}
						/>
					</DialogContent>
				</Dialog>
			</LocalizationProvider>
		</>
	);
};

export default Calendar;
