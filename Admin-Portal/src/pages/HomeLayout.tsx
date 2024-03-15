import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Tab, Tabs, Typography, Button } from '@mui/material';
import { CAPTIONS } from '../lib/constants';
import { useAuth } from '../lib/contexts';
import './styles/datagrid.css';
import './styles/sidebar.css';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import GroupIcon from '@mui/icons-material/Group';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

interface LinkTabProps {
	label: string;
	href?: string;
	selected?: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
	donations: VolunteerActivismIcon,
	inventory: ContentPasteSearchIcon,
	users: GroupIcon,
	admins: CorporateFareIcon,
	cashdonations: LocalAtmIcon,
	reports: AssessmentIcon,
};
const LinkTab = ({ label, ...props }: LinkTabProps) => {
	const navigate = useNavigate();
	const IconComponent = iconMap[label.toLowerCase().replace(/\s/g, '')];

	return (
		<Tab
			className='navTab'
			iconPosition='start'
			icon={IconComponent && <IconComponent />}
			component='a'
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
				event.preventDefault();
				navigate(props.href!);
			}}
			aria-current={props.selected && 'page'}
			sx={{ '&.Mui-selected': { bgcolor: '#bbdefb' } }}
			label={
				<Typography align={'left'} className='navTabText'>
					{label}
				</Typography>
			}
			{...props}
		/>
	);
};

const HomeLayout: React.FC = () => {
	const location = useLocation();
	const currentPathname = location.pathname.substring(1);
	const captionsToPathnames = CAPTIONS.map((caption) => caption.replace(/\s/g, '').toLowerCase());
	const [curPage, setCurPage] = React.useState(captionsToPathnames.indexOf(currentPathname.toLowerCase()));
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleChange = (_event: React.SyntheticEvent, newPage: number) => {
		setCurPage(newPage);
	};
	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<StyledEngineProvider injectFirst>
			<Box sx={{ display: 'flex' }} className='sideBar'>
				<Box
					sx={{
						flex: '0 0 15%',
						borderRight: 1,
						borderColor: 'divider',
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Tabs
						value={curPage}
						onChange={handleChange}
						aria-label='nav tabs'
						role='navigation'
						orientation='vertical'
						className='tabsContainer'
					>
						{CAPTIONS.map((caption, index) => (
							<LinkTab key={index} label={caption} href={`/${caption.replace(/\s/g, '')}`} />
						))}
					</Tabs>
					<Button sx={{ marginButton: 'auto' }} onClick={handleLogout}>
						Logout
					</Button>
					<Box className='appInfoContainer'>
						<Typography className='appNameText'>Mother to Mother</Typography>
						<Typography className='versionText'>Version 1.0.0</Typography>
					</Box>
				</Box>
				<Box sx={{ flex: 1, p: 3 }}>
					<Typography variant='h5' gutterBottom sx={{ marginBottom: '25px' }}>
						{CAPTIONS[curPage]}
					</Typography>
					{<Outlet />}
				</Box>
			</Box>
		</StyledEngineProvider>
	);
};

export default HomeLayout;
