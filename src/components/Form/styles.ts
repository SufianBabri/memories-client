import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
		},
	},
	paper: {
		width: 290,
		justify: 'center',
	},
	form: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		padding: 10,
	},
	fileInput: {
		width: '97%',
		margin: '10px 0',
	},
	buttonSubmit: {
		margin: 5,
	},
}));
