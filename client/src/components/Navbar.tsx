import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { StateContext, useStateValue } from '../state';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUser } from '../types';
import { AlertContext } from './AlertProvider';
import { logoutUser } from '../services/logout';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { socket } from '../services/socket';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const NotificationsButton = () => {

	return (
		<>
			<Button color="inherit" component={Link} to="/profile">
				Profile
			</Button>
		</>
	);
};

const LoggedInUserButtons = ({
	loggedUser,
	handleLogout
}: {
	loggedUser: LoggedUser;
	handleLogout: any;
}) => {
	return (
		<>
			<NotificationsButton />
			<em>{loggedUser?.username} logged in </em>
			{/* <Button color="inherit" component={Link} to="/profile">
				Profile
			</Button> */}
			<Button onClick={handleLogout} color="inherit">
				Logout
			</Button>
		</>
	);
};

const LoggedOutButtons = () => {
	return (
		<>
			<Button color="inherit" component={Link} to="/login">
				Login
			</Button>
			<Button color="inherit" component={Link} to="/signup">
				Sign Up
			</Button>
		</>
	);
};

const drawerWidth = 200;

const Navbar = ({
	setMobileOpen,
	mobileOpen
}: {
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mobileOpen: boolean;
}) => {
	const [, dispatch] = useStateValue();
	const loggedUser = useContext(StateContext);
	const navigate = useNavigate();
	const alert = useContext(AlertContext);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleLogout = async (event: any) => {
		event.preventDefault();
		logoutUser(dispatch);
		if (socket.connected) {
			socket.disconnect();
		}
		alert.success('Logged out');
		navigate('/');
	};

	return (
		<AppBar
			position="fixed"
			color="secondary"
			sx={{
				ml: { sm: `${drawerWidth}px` },
				mb: 5,
				zIndex: (theme) => theme.zIndex.drawer + 1,
				justifyContent: 'space-between',
				'& .MuiAppBar-root': {
					borderRadius: '0!important'
				}
			}}
		>
			<Toolbar
				sx={{
					justifyContent: 'space-between',
					'& .MuiPaper-root': {
						borderRadius: '0!important'
					}
				}}
			>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, ml: 0.5, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<LoyaltyIcon
					color="primary"
					sx={{
						ml: 1,
						display: { xs: 'none', sm: 'block' }
					}}
				/>
				<div>
					<Typography
						color="primary"
						component={Link}
						to="/"
						sx={{
							flexGrow: 1,
							display: { xs: 'none', sm: 'block' }
						}}
					></Typography>
					{loggedUser[0].loggedUser !== undefined ? (
						<LoggedInUserButtons
							loggedUser={loggedUser[0].loggedUser}
							handleLogout={handleLogout}
						/>
					) : (
						<LoggedOutButtons />
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
