import React, { useState } from 'react';
import {
	Container,
	AppBar,
	Typography,
	Grow,
	Grid,
	Snackbar,
} from '@material-ui/core';
import { ReactQueryDevtools } from 'react-query-devtools';
import memories from './images/memories.png';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import useStyles from './styles';
import MySnackbar from './components/alerts/MySnackbar';
import SnackbarContext from './context/SnackbarContext';
import { Alert } from '@material-ui/lab';

const App = () => {
	const [currentId, setCurrentId] = useState<string | null>(null);
	const classes = useStyles();
	const [snackbarText, setSnackbarText] = useState<string | undefined>(
		undefined
	);

	return (
		<Container maxWidth="lg">
			<AppBar
				className={classes.appBar}
				position="static"
				color="inherit">
				<Typography
					className={classes.heading}
					variant="h2"
					align="center">
					Memories
				</Typography>
				<img
					className={classes.image}
					src={memories}
					alt="memories"
					height="60"
				/>
			</AppBar>
			<Grow in>
				<Container>
					<SnackbarContext.Provider
						value={{
							setSnackbarText: (text) => setSnackbarText(text),
						}}>
						<MySnackbar text={snackbarText} />
						<Grid
							container
							className={classes.mainContainer}
							justify="space-between"
							alignItems="stretch"
							spacing={3}>
							<Grid item xs={12} sm={7}>
								<Posts setCurrentId={setCurrentId} />
							</Grid>
							<Grid item xs={12} sm={4}>
								<Form
									currentId={currentId}
									setCurrentId={setCurrentId}
								/>
							</Grid>
						</Grid>
					</SnackbarContext.Provider>
				</Container>
			</Grow>
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</Container>
	);
};

export default App;
