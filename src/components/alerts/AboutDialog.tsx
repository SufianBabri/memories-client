import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@material-ui/core';
import packageJson from '../../../package.json';

export interface IAboutDialogProps {
	openAbout: boolean;
	setOpenAbout(open: boolean): void;
}

const AboutDialog = ({ openAbout, setOpenAbout }: IAboutDialogProps) => {
	const handleCloseAbout = () => setOpenAbout(false);
	return (
		<Dialog
			open={openAbout}
			onClose={handleCloseAbout}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">
				Memories v{packageJson.version}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					This application is build in MERN stack by{' '}
					<a href="http://github.com/sufianbabri">Sufian Babri</a>.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseAbout} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AboutDialog;
