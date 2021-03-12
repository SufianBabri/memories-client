import {useContext} from 'react';
import {Control, Controller, FieldError} from 'react-hook-form';
import SnackbarContext from '../../context/SnackbarContext';
import {Typography} from '@material-ui/core';
import {isFileBiggerThan2MB, readImageAsBase64Data} from '../../utils/fileUtils';
import {makeStyles} from '@material-ui/core/styles';
import ImageInput from './ImageInput';

interface Props {
	name: string;
	imageData: string;
	control: Control<any>;
	error?: FieldError | undefined;

	onUpdate(imageData: string): void;
}

export default function ImagePicker({name, imageData, control, error, onUpdate}: Props) {
	const classes = useStyles();
	const snackbarContext = useContext(SnackbarContext);

	function onHandleFileSelection(file: File) {
		if (isFileBiggerThan2MB(file)) {
			snackbarContext.setContent({
				text: 'File size can not exceed 2MB',
				type: 'error'
			});
			return;
		}
		readImageAsBase64Data(file)
			.then((imageData) => {
				onUpdate(imageData);
			})
			.catch((e) => {
			});
	}

	return (
		<div className={classes.mainContainer}>
			{imageData && <img className={classes.thumbnail} src={imageData} alt="" />}
			<Controller
				name={name}
				control={control}
				defaultValue=""
				render={() => (
					<ImageInput caption="(Max filesize = 2MB)" onFileSelected={onHandleFileSelection} />
				)}
			/>
			{error && (<Typography color="error">{error.message}</Typography>)}
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		margin: 'auto',
		marginTop: '25px',
		width: '90%'
	},
	thumbnail: {
		width: 70,
		height: 70
	}
}));