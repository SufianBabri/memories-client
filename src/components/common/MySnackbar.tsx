import React, { useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import SnackbarContext from '../context/SnackbarContext';
import MuiAlert from '@material-ui/lab/Alert';
import Slide, { SlideProps } from '@material-ui/core/Slide';

type TransitionProps = Omit<SlideProps, 'direction'>;

export type AlertType = 'error' | 'info' | 'success' | 'warning';
export type AlertVariant = 'filled' | 'outlined' | 'standard';
export interface Props {
	text?: string;
	autoHideDuration?: number;
	type?: AlertType;
}

const MySnackbar: React.FC<Props> = ({
	text,
	autoHideDuration,
	type,
}: Props) => {
	const snackbarContext = useContext(SnackbarContext);

	if (text === undefined) return null;

	const duration = autoHideDuration ?? 5000;
	const severity = type ?? 'info';
	const transition = TransitionUp;
	return (
		<Snackbar
			onClose={() => snackbarContext.setContent(undefined)}
			autoHideDuration={duration}
			open={text !== undefined}
			TransitionComponent={transition}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}>
			<MuiAlert elevation={6} variant="filled" severity={severity}>
				{text}
			</MuiAlert>
		</Snackbar>
	);
};

function TransitionUp(props: TransitionProps) {
	return <Slide {...props} direction="up" />;
}

export default MySnackbar;
