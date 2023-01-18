import { Button, Link, styled, Box, Paper, Typography } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	margin: '1rem',
	padding: '1rem 2.5rem 3rem 2.5rem',
	maxWidth: '620px',
	zIndex: '5000',
	position: 'absolute',
	textAlign: 'center',
	color: theme.palette.text.secondary
}));

const LandingPaper = () => {
	return (
		<StyledPaper>
			<Box
				sx={{
					marginTop: 6,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<Typography variant="h3" sx={{ fontWeight: '700', marginBottom: '1rem' }}>
					Find true love today
				</Typography>
				<Typography>
					Make your connection and start building something real with us. Join Matcha or sign in  if you already have an account.
				</Typography>
				<Box
					sx={{
						mt: 1,
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						justifyContent: 'space-around'
					}}
				>
					<Link href="/signup" variant="body2" sx={{ mt: 2, mb: 2, width: '35%' }}>
						<Button fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
							Join
						</Button>
					</Link>
					<Link href="/login" variant="body2" sx={{ mt: 2, mb: 2, width: '35%' }}>
						<Button fullWidth variant="outlined" sx={{ mt: 2, mb: 2 }}>
							Sign in
						</Button>
					</Link>
				</Box>
			</Box>
		</StyledPaper>
	);
};

export default LandingPaper;
