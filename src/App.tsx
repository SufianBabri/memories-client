import React, { useState } from 'react';
import {
	Fab,
	Container,
	AppBar,
	Typography,
	Grow,
	Toolbar,
	IconButton,
	Grid,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import { ReactQueryDevtools } from 'react-query-devtools';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import useStyles from './styles';
import MySnackbar, { Props as SnackbarProps } from './components/MySnackbar';
import SnackbarContext from './context/SnackbarContext';
import AboutDialog from './components/dialogs/AboutDialog';
import MemoryDialog from './components/dialogs/MemoryDialog';

const App = () => {
	const [currentId, setCurrentId] = useState<string | null>(null);
	const classes = useStyles();
	const [snackbarProps, setSnackbarProps] = useState<
		SnackbarProps | undefined
	>(undefined);
	const [openAbout, setOpenAbout] = useState(false);
	const [openMemoryDialog, setOpenMemoryDialog] = useState(false);

	return (
		<Container maxWidth={false} className={classes.container}>
			<AppBar style={{ margin: '0' }}>
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
			<Grow in style={{ paddingTop: 90 }}>
				<Container>
					<SnackbarContext.Provider
						value={{
							setContent: (props) => setSnackbarProps(props),
						}}>
						<MySnackbar {...snackbarProps} />
						<Form
							currentId={currentId}
							setCurrentId={setCurrentId}
						/>
						<Grid
							container
							justify="space-between"
							alignItems="stretch"
							spacing={3}>
							<Grid item xs={12} sm={7}>
								<Posts setCurrentId={setCurrentId} />
							</Grid>
						</Grid>
					</SnackbarContext.Provider>
				</Container>
			</Grow>
			<Fab
				color="primary"
				aria-label="create a memory"
				style={{
					position: 'fixed',
					bottom: 10,
					right: 10,
				}}
				onClick={() => setOpenMemoryDialog(true)}>
				<AddIcon />
			</Fab>
			<MemoryDialog
				open={openMemoryDialog}
				setOpen={setOpenMemoryDialog}
				showError={(msg) => setSnackbarProps({ text: msg })}
			/>
			<AboutDialog open={openAbout} setOpen={setOpenAbout} />
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</Container>
	);
};

export default App;
