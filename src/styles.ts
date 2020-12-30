import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	container: {
		padding: '0',
	},
	title: { flexGrow: 1 },
	heading: {
		color: 'rgba(0,183,255, 1)',
	},
	image: {
		marginLeft: '15px',
	},
	[theme.breakpoints.down('sm')]: {
		mainContainer: {
			flexDirection: 'column-reverse',
		},
	},
}));
