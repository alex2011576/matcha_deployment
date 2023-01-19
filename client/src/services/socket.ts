import { io, Socket } from 'socket.io-client';
import { ChatCallback, ChatMsg, LoggedUser, MessageNotification } from '../types';

interface ServerToClientEvents {
	receive_message: (message: ChatMsg) => void;
	reload_chat: (match_id: string | undefined) => void;
	// receive_notification: (message: any) => void;
	// online_response: (data: any) => void;
	chat_notification: (chatNotification: MessageNotification) => void;
	notification: (notification_message: string) => void;
}

interface ClientToServerEvents {
	send_message: (match_id: string, message: string) => void;
	// send_notification: (receiver_id: number, notification: {}) => void;
	// set_user: (receiver_id: number) => void;
	active_chat: (match_id: string, callback: ChatCallback) => void;
	clear_chat_notifications: (matchId: string) => void;
	clear_notifications: () => void;
	online_query: (
		user_id: string,
		callback: ({ online, lastActive }: { online: boolean; lastActive: number }) => void
	) => void;
	auth: { token: string; user_id: number };
}

// export const getTokenFromSessionStorage = () => {
// 	if (typeof window === 'undefined') return null;
// 	return window.sessionStorage.getItem('accessToken');
// };

export const getSessionIDFromLocalStorage = (): LoggedUser | undefined => {
	const loggedUserJSON = localStorage.getItem('loggedUser');
	return loggedUserJSON ? JSON.parse(loggedUserJSON).token : undefined;
};

export const getUserIDFromLocalStorage = (): LoggedUser | undefined => {
	const loggedUserJSON = localStorage.getItem('loggedUser');
	return loggedUserJSON ? JSON.parse(loggedUserJSON).id : undefined;
};

interface Auth {
	sessionId: string;
	user_id: string;
}
export const getAuth = (): Auth => {
	const loggedUserJSON = localStorage.getItem('loggedUser');
	if (loggedUserJSON) {
		const loggedUser: LoggedUser = JSON.parse(loggedUserJSON);
		return {
			sessionId: loggedUser.token,
			user_id: loggedUser.id
		};
	}
	return {
		sessionId: '',
		user_id: ''
	};
};
// export const getUserIDFromSessionStorage = () => {
// 	if (typeof window === 'undefined') return null;
// 	const storedInfo = window.sessionStorage.getItem('userData');
// 	if (storedInfo) {
// 		return JSON.parse(storedInfo).user_id;
// 	}
// 	return null;
// };

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	'https://matcha-server-ilona-aleksei.onrender.com',
	{
		autoConnect: false,
		reconnection: true,
		auth: getAuth()
	}
);
