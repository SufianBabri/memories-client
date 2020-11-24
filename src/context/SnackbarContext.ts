import React from 'react';

export type SnackbarContextType = {
	setSnackbarText: (text: string | undefined) => void;
};

const SnackbarContext = React.createContext<SnackbarContextType>({
	setSnackbarText: (text) => console.warn('No implementation exists'),
});

export default SnackbarContext;
