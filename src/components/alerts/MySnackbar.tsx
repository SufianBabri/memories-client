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

	const autoHideDuration = props.autoHideDuration ?? 5000;

	return (
		<Snackbar
			onClose={() => snackbarContext.setSnackbarText(undefined)}
			autoHideDuration={autoHideDuration}
			open={props.text !== undefined}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}>
			<SnackbarContent
				message={props.text}
				style={{
					backgroundColor: 'white',
					color: 'black',
				}}
			/>
		</Snackbar>
	);
};

export default MySnackbar;
