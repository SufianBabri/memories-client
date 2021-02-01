import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@material-ui/core';
import PostDto from '../../dto/postDto';
import MemoryForm from '../MemoryForm/MemoryForm';

export interface IProps {
	open: boolean;
	setOpen(open: boolean): void;
	post?: PostDto;
	showError(msg: string): void;
}

const MemoryDialog = ({ open, setOpen, post, showError }: IProps) => {
	const handleClose = () => setOpen(false);
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title">
			<DialogTitle id="alert-dialog-title">
				{post ? 'Editing' : 'Creating'} a Memory
			</DialogTitle>
			<DialogContent>
				<MemoryForm
					currentId=""
					setCurrentId={() => console.log('hello')}
					showError={showError}
				/>
			</DialogContent>
			<DialogActions>
				<Button color="primary">Publish</Button>
			</DialogActions>
		</Dialog>
	);
};

export default MemoryDialog;
