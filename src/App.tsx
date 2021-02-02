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
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import { ReactQueryDevtools } from 'react-query-devtools';
import Posts from './components/Posts';
import MySnackbar, { Props as SnackbarProps } from './components/MySnackbar';
import SnackbarContext from './context/SnackbarContext';
import AboutDialog from './components/dialogs/AboutDialog';
import MemoryDialog from './components/dialogs/MemoryDialog';

export default function App() {
	const classes = useStyles();

	const [snackbarProps, setSnackbarProps] = useState<
		SnackbarProps | undefined
	>();
	const [openAbout, setOpenAbout] = useState(false);
	const [openMemoryDialog, setOpenMemoryDialog] = useState(false);

	return (
		<SnackbarContext.Provider
			value={{
				setContent: (props) => setSnackbarProps(props),
			}}>
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
						<Grid
							container
							justify="space-between"
							alignItems="stretch"
							spacing={3}>
							<Grid item xs={12} sm={7}>
								<Posts />
							</Grid>
						</Grid>
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
				<MySnackbar {...snackbarProps} />
				{process.env.NODE_ENV === 'development' && (
					<ReactQueryDevtools initialIsOpen={false} />
				)}
			</Container>
		</SnackbarContext.Provider>
	);
}

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '0',
	},
	title: { flexGrow: 1 },
	heading: {
		color: 'rgba(0,183,255, 1)',
	},
	image: {
		marginLeft: '15px',
	},
}));
