import {useContext} from 'react';
import {Control, Controller, FieldError} from 'react-hook-form';
import SnackbarContext from '../../context/SnackbarContext';
import {Typography} from '@material-ui/core';
import {isFileBiggerThan2MB, readImageAsBase64Data} from '../../utils/fileUtils';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
	name: string;
	imageData: string;
	control: Control<any>;
	error?: FieldError | undefined;

	onUpdate(imageData: string): void;
}

export default function ImagePicker({
										name,
										imageData,
										control,
										error,
										onUpdate
									}: Props) {
	const classes = useStyles();
	const snackbarContext = useContext(SnackbarContext);

	return (
		<div className={classes.mainContainer}>
			{imageData && <img className={classes.thumbnail} src={imageData} alt="" />}
			<div>
				<Controller
					name={name}
					control={control}
					defaultValue=""
					render={() => (
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const files = e.target.files;
								if (!files || files.length === 0) return;

								const file = files[0];
								if (isFileBiggerThan2MB(file)) {
									snackbarContext.setContent({
										text: 'File size can not exceed 2MB',
										type: 'error'
									});
									return;
								}
								readImageAsBase64Data(files[0])
									.then((imageData) => {
										onUpdate(imageData);
									})
									.catch((e) => {
									});
							}}
						/>
					)}
				/>
				{error && (
					<Typography color="error">{error.message}</Typography>
				)}
				<Typography>(Max filesize = 2MB)</Typography>
			</div>
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