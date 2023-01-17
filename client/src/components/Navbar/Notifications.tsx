import { Avatar, Badge, Box, CircularProgress, Divider, styled } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NotificationQueue, Notifications, NotificationMsg } from '../../types';
import { AlertContext } from '../AlertProvider';
import { socket } from '../../services/socket';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getNotifications, getNotificationsQueue } from '../../services/notifications';
import { StyledLink } from '../UserList';

const ITEM_HEIGHT = 48;

interface NotificationsListProps {
	open: boolean;
	anchorEl: HTMLElement | null;
	handleClose: () => void;
}

const LoadingNotficationIcon = () => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<CircularProgress />
		</Box>
	);
};

const StyledBox = styled(Box)`
	color: rgba(0, 0, 0, 0.6);
	text-decoration: none;
`;

const NotificationItem = ({
	NotificationData
}: {
	NotificationData: NotificationMsg;
}) => {
	// In case we decide to customise different messages
	//
	// switch (NotificationData.type) {
	// 	case 'like':
	// 		return (
	// 			<Box sx={{display: 'inline-flex', alignItems: 'center' }}>
	// 				<Avatar alt={`Avatar of user ${NotificationData.username}`} src={`${NotificationData.avatar}`} sx={{ width:24, height: 24, mr: 1}} />
	// 				<StyledLink to={`/profile/${NotificationData.id}` }>
	// 					{NotificationData.message}
	// 				</StyledLink>
	// 			</Box>
	// 		);
	// 	case 'dislike':
	// 		return (
	// 			<Box sx={{display: 'inline-flex', alignItems: 'center'}}>
	// 				<Avatar alt={`Avatar of user ${NotificationData.username}`} src={`${NotificationData.avatar}`} sx={{ width:24, height: 24, mr: 1}} />
	// 				<StyledLink to={`/profile/${NotificationData.id}` }>
	// 					{NotificationData.message}
	// 				</StyledLink>
	// 			</Box>
	// 		);
	// 	case 'visit':
	// 		return (
	// 			<Box sx={{display: 'inline-flex', alignItems: 'center'}}>
	// 				<Avatar alt={`Avatar of user ${NotificationData.username}`} src={`${NotificationData.avatar}`} sx={{ width:24, height: 24, mr: 1}} />
	// 				<StyledLink to={`/profile/${NotificationData.id}` }>
	// 					{NotificationData.message}
	// 				</StyledLink>
	// 			</Box>
	// 		);
	// 	case 'match':
	// 		return (
	// 			<Box sx={{display: 'inline-flex', alignItems: 'center'}}>
	// 				<Avatar alt={`Avatar of user ${NotificationData.username}`} src={`${NotificationData.avatar}`} sx={{ width:24, height: 24, mr: 1}} />
	// 				<StyledLink to={`/profile/${NotificationData.id}` }>
	// 					{NotificationData.message}
	// 				</StyledLink>
	// 			</Box>
	// 		);
	// }
	return (
		<Box
			sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
			fontSize={{ xs: 10, sm: 16, md: 16 }}
		>
			<Avatar
				alt={`Avatar of user ${NotificationData.username}`}
				src={`${NotificationData.avatar}`}
				sx={{ width: 24, height: 24, mr: 1 }}
			/>
			{NotificationData.message}
		</Box>
	);
};

const NotificationsList = ({ ...props }: NotificationsListProps) => {
	const {
		data: NotificationsData,
		error: NotificationsError
	}: { data: Notifications | undefined; error: Error | undefined } = useServiceCall(
		async () => await getNotifications(),
		[]
	);

	return (
		<Menu
			id="long-menu"
			MenuListProps={{
				'aria-labelledby': 'long-button'
			}}
			disableScrollLock={true}
			anchorEl={props.anchorEl}
			open={props.open}
			onClose={props.handleClose}
			PaperProps={{
				style: {
					maxHeight: ITEM_HEIGHT * 4.5,
					width: '30em'
				}
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			{NotificationsData ? (
				NotificationsData.notifications.length ? (
					NotificationsData.notifications.map((item, index) => (
						<div key={index}>
							<StyledLink to={`/profile/${item.id}`}>
								<MenuItem sx= {{my: 1}} onClick={props.handleClose}>
									<NotificationItem NotificationData={item} />
								</MenuItem>
							</StyledLink>
							<Divider />
						</div>
					))
				) : (
					<StyledBox>
						<MenuItem onClick={props.handleClose}>
							{`You haven't received any notification yet!`}
						</MenuItem>
					</StyledBox>
				)
			) : NotificationsError ? (
				<StyledBox>
						<MenuItem onClick={props.handleClose}>
							{`Notifications loading failed, try again!`}
						</MenuItem>
				</StyledBox>
			) : (
				<LoadingNotficationIcon />
			)}
		</Menu>
	);
};

const NotificationsButton = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const alert = useContext(AlertContext);

	const {
		data: NotifQueueData,
		error: NotifQueueError
	}: { data: NotificationQueue | undefined; error: Error | undefined } = useServiceCall(
		async () => await getNotificationsQueue(),
		[]
	);
	void NotifQueueError;

	const [initialCount, setInitialCount] = useState<number>(0);

	useEffect(() => {
		if (NotifQueueData) {
			setInitialCount(NotifQueueData.initialCount);
		}
	}, [NotifQueueData]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		socket.on('notification', (msg) => {
			setCounter((prev) => prev + 1);
			alert.success(msg);
		});
		return () => {
			socket.off('notification');
		};
	}, [alert]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		socket.emit('clear_notifications');
		setCounter(0);
		setInitialCount(0);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Badge
				badgeContent={initialCount + counter}
				max={999}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				overlap="circular"
				color="error"
			>
				<IconButton
					aria-label="notifications"
					id="long-button"
					aria-controls={open ? 'long-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup="true"
					sx={{mr:0}}
					onClick={handleClick}
				>
					<NotificationsActiveIcon
						fontSize="medium"
						color={NotifQueueData ? 'primary' : 'disabled'}
					/>
				</IconButton>
			</Badge>
			{open && (
				<NotificationsList
					anchorEl={anchorEl}
					open={open}
					handleClose={handleClose}
				/>
			)}
		</>
	);
};

export default NotificationsButton;
