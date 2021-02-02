import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Button,
	DialogActions,
} from '@material-ui/core';

interface Props {
	open: boolean;
	setOpen(open: boolean): void;
	onDismiss(): void;
}

export default function ErrorDialog({ open, setOpen, onDismiss }: Props) {
	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">
				File is too large!
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{'Please select a file which is no bigger than 2MB'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onDismiss} color="primary" autoFocus>
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	);
}
