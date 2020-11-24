import React, { useContext } from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import SnackbarContext from '../../context/SnackbarContext';

export type AlertType = 'error' | 'info' | 'success' | 'warning';
export type AlertVariant = 'filled' | 'outlined' | 'standard';
export interface IMySnackbarProps {
	text?: string;
	autoHideDuration?: number;
}

const MySnackbar: React.FC<IMySnackbarProps> = (props) => {
	const snackbarContext = useContext(SnackbarContext);

	if (props.text === undefined) return null;

	return (
		<Snackbar
			message={props.text}
			onClose={() => snackbarContext.setSnackbarText(undefined)}
			autoHideDuration={props.autoHideDuration}
			open={props.text !== undefined}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
		/>
	);
};

export default MySnackbar;
