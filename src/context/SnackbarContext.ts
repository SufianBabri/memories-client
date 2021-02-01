import React from 'react';
import { Props as SnackbarProps } from '../components/MySnackbar';

export type SnackbarContextType = {
	setContent: (props?: SnackbarProps) => void;
};

const SnackbarContext = React.createContext<SnackbarContextType>({
	setContent: (text) => console.warn('No implementation exists'),
});

export default SnackbarContext;
