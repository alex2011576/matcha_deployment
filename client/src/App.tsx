import styled from '@emotion/styled';

import Landing from './components/LandingPage/LandingPage';
import MatchSuggestions from './components/MatchSuggestions';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword/index';
import ResponsiveDrawer from './components/Drawer';
import ProfileEditor from './components/ProfileEditor';
import UpdateEmail from './components/UpdateEmail';
import AlertProvider from './components/AlertProvider';
import AlertSnackBar from './components/AlertSnackBar';
import PublicProfilePage from './components/PublicProfile/PublicProfilePage';
import VisitHistory from './components/VisitHistory';
import Matches from './components/Matches';
import Blocks from './components/Blocks';
import Likes from './components/Likes';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Chats from './components/Chats';
import Footer from './components/Footer';
import { ChatReloadProvider } from './components/ChatWindow/ChatReloadProvider';

import { ErrorBoundary } from 'react-error-boundary';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import { socket } from './services/socket';
import { StateContext } from './state';

const MinWidthContainer = styled.div`
	display: flex;
	max-width: 100%;
	min-width: 300px;
	height: 100%;
`;

const StyledBox = styled(Box)`
	text-align: center;
	flex-grow: 1;
	position: relative;
	top: 5rem;
	max-width: 100%;
	min-width: 320px;
`;

function ErrorFallback({
	error,
	resetErrorBoundary
}: {
	error: any;
	resetErrorBoundary: any;
}) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

const App = () => {
	const [{ loggedUser }] = useContext(StateContext);

	useEffect(() => {
		if (loggedUser) {
			socket.auth = {
				sessionId: loggedUser.token,
				user_id: loggedUser.id
			};
			if (!socket.connected) socket.connect();
		}
	}, [loggedUser]);

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => {
				return <Navigate to="/" />;
			}}
		>
			<MinWidthContainer>
				<SnackbarProvider>
					<AlertProvider>
						<ChatReloadProvider>
							<ResponsiveDrawer />
							<StyledBox>
								<AlertSnackBar />
								<Routes>
									<Route
										path="/"
										element={
											loggedUser ? <MatchSuggestions /> : <Landing />
										}
									/>
									<Route
										path="/login"
										element={
											!loggedUser ? <LoginForm /> : <Navigate to="/" />
										}
									/>
									<Route
										path="/signup"
										element={
											!loggedUser ? <SignUpForm /> : <Navigate to="/" />
										}
									/>
									<Route
										path="/forgot_password"
										element={
											!loggedUser ? (
												<ForgotPassword />
											) : (
												<Navigate to="/" />
											)
										}
									/>
									<Route path="/profile" element={<ProfileEditor />} />
									<Route
										path="/profile/:id"
										element={<PublicProfilePage />}
									/>
									<Route path="/update_email" element={<UpdateEmail />} />
									<Route path="/visit_history" element={<VisitHistory />} />
									<Route path="/likes" element={<Likes />} />
									<Route path="/matches" element={<Matches />} />
									<Route path="/blocks" element={<Blocks />} />
									<Route path="/chats" element={<Chats />} />
									<Route path="/chats/:id" element={<ChatWindow />} />
									<Route path="*" element={<Navigate to="/" replace />} />
								</Routes>
								<Footer />
							</StyledBox>
						</ChatReloadProvider>
					</AlertProvider>
				</SnackbarProvider>
			</MinWidthContainer>
		</ErrorBoundary>
	);
};

export default App;
