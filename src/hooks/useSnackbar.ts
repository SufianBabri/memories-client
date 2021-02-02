import { useEffect, useContext } from 'react';
import SnackbarContext from '../context/SnackbarContext';
import ApiError from '../data/ApiError';

export function useError(e?: ApiError) {
	const snackbarContext = useContext(SnackbarContext);

	useEffect(() => {
		if (!e) return;

		console.log(e.message, e.error);

		snackbarContext.setContent({ text: e.message, type: 'error' });
	}, [e]);
}
