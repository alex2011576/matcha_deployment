import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';
import locationRouter from './routes/location';

import { globalErrorHandler, unknownEndpoint } from './errors';
import { sessionExtractorSocket, sessionIdExtractor } from './utils/middleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { CallbackSucess, ClientToServerEvents, ServerToClientEvents, SocketCustom, ChatCallback, ChatMsg } from './types';
import { socketErrorHandler } from './errorsSocket';
import { addChatMessage, authChatActivation, queryOnlineUsers, updateOnlineUsers } from './services/users';
import { removeNotificationsQueueById } from './repositories/notificationsQueueRepository';
import { addChatNotificationsEntry, deleteNotificationsByMatchAndReceiver } from './repositories/chatNotificationsRepostiory';

export const app = express();
export const httpServer = createServer(app);
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		// origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});
io.use(sessionExtractorSocket);

io.on(
	'connection',
	socketErrorHandler(async (socket: SocketCustom) => {
		if (!socket.session) return;
		await updateOnlineUsers(socket.session.userId);
		await socket.join(socket.session.userId);
		// console.log('client connected: ', socket.id);

		// Online query
		socket.on(
			'online_query',
			socketErrorHandler(async (user_id: string, callback: CallbackSucess) => {
				const onlineStatus = await queryOnlineUsers(user_id);
				callback(onlineStatus);
				// console.log(`online_query: ${onlineStatus.online}`);
			})
		);

		socket.on(
			'active_chat',
			socketErrorHandler(async (match_id: string, cb: ChatCallback) => {
				if (!socket.session) return;
				//session id is used to check that user accessing api has rights to access
				const isAuth = await authChatActivation(match_id, socket.session.userId);
				await socket.join(match_id);
				cb(isAuth);
				//add here notifications queue cleaner for notifs where matchId, receiverId
				await deleteNotificationsByMatchAndReceiver(match_id, socket.session.userId);
			})
		);

		socket.on(
			'send_message',
			socketErrorHandler(async (match_id: string, message: string) => {
				if (!socket.session) return;
				//session id is used to check that user accessing api has rights to access
				const createdMsg: ChatMsg = await addChatMessage(match_id, socket.session.userId, message);
				io.in(match_id).emit('receive_message', createdMsg);
				const newChatNotification = await addChatNotificationsEntry(match_id, createdMsg.sender_id, createdMsg.receiver_id);
				if (newChatNotification) socket.to(createdMsg.receiver_id).emit('chat_notification', newChatNotification);
			})
		);

		// Clear notification queue
		socket.on(
			'clear_notifications',
			socketErrorHandler(async () => {
				if (socket.session) await removeNotificationsQueueById(socket.session.userId);
			})
		);
		socket.on(
			'clear_chat_notifications',
			socketErrorHandler(async (matchId: string) => {
				if (socket.session) await deleteNotificationsByMatchAndReceiver(matchId, socket.session.userId);
			})
		);

		socket.on('connect_error', (_err: { message: string }) => {
			//console.log(`connect_error due to ${err.message}`);
		});

		socket.on('disconnect', (_reason: string) => {
			//console.log('client disconnected: ', socket.id, reason);
		});
	})
);

app.use(express.json({ limit: '50mb' }));

app.use(cors());

dotenv.config();

app.use(sessionIdExtractor);

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/location', locationRouter);

// Error handler for errors
app.use(globalErrorHandler);

app.use(unknownEndpoint);
