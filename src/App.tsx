import React, { useState } from 'react';
import {
	Container,
	AppBar,
	Typography,
	Grow,
	Toolbar,
	IconButton,
	Grid,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { ReactQueryDevtools } from 'react-query-devtools';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import useStyles from './styles';
import MySnackbar from './components/alerts/MySnackbar';
import SnackbarContext from './context/SnackbarContext';
import AboutDialog from './components/alerts/AboutDialog';

const App = () => {
	const [currentId, setCurrentId] = useState<string | null>(null);
	const classes = useStyles();
	const [snackbarText, setSnackbarText] = useState<string | undefined>(
		undefined
	);
	const [openAbout, setOpenAbout] = useState(false);

	return (
		<Container maxWidth="lg" className={classes.container}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						Memories
					</Typography>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="about app"
						onClick={() => setOpenAbout(true)}>
						<InfoIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Grow in style={{ marginTop: 10 }}>
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
			<AboutDialog openAbout={openAbout} setOpenAbout={setOpenAbout} />
		</Container>
	);
};

export default App;
