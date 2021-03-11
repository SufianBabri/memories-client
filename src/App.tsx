import React, { useState } from 'react';
import {
	Fab,
	Container,
	AppBar,
	Typography,
	Toolbar,
	IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import { ReactQueryDevtools } from 'react-query-devtools';
import Posts from './components/common/Posts';
import MySnackbar, { Props as SnackbarProps } from './components/common/MySnackbar';
import SnackbarContext from './context/SnackbarContext';
import AboutDialog from './components/dialogs/AboutDialog';
import NewMemoryDialog from './components/dialogs/NewMemoryDialog';

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

				<Container style={{ marginTop: 90 }}>
					<Posts />
				</Container>

				<Fab
					color="primary"
					aria-label="create a memory"
					style={{
						position: 'fixed',
						bottom: 25,
						right: 25,
					}}
					onClick={() => setOpenMemoryDialog(true)}>
					<AddIcon />
				</Fab>
				<NewMemoryDialog
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

const useStyles = makeStyles({
	container: {
		padding: '0',
	},
	title: { flexGrow: 1 },
});
