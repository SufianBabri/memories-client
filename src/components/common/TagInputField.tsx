import React, {useContext} from 'react';
import {Control, Controller, FieldError} from 'react-hook-form';
import ChipInput from 'material-ui-chip-input';
import SnackbarContext from '../../context/SnackbarContext';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
	name: string;
	maxTagLength: number;
	error?: FieldError | undefined | (FieldError | undefined)[];
	control: Control<any>;
}

export default function TagInputField({
										  name,
										  maxTagLength,
										  error,
										  control
									  }: Props) {
	const classes = useStyles();
	const parseTagsError = (
		errors: FieldError | undefined | (FieldError | undefined)[]
	) => {
		if (errors === undefined) {
			return '';
		}

		if (errors instanceof Array) {
			let errorString = '';
			errors.map((e) => (errorString += e?.message ?? ''));
			return errorString;
		} else {
			return errors.message;
		}
	};
	const snackbarContext = useContext(SnackbarContext);

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={[]}
			render={({onChange}) => (
				<ChipInput
					className={classes.chipInput}
					onChange={(e) => {
						console.log('tagInput', e);
						onChange(e);
					}}
					error={error !== undefined}
					helperText={parseTagsError(error)}
					variant="outlined"
					label="Tags"
					onBeforeAdd={(newTag: string) => {
						const isTagTooLong = newTag.length > maxTagLength;
						if (isTagTooLong) {
							snackbarContext.setContent({
								text: `Tag can not be more than ${maxTagLength} characters long`,
								type: 'error'
							});
						}
						return !isTagTooLong;
					}}
					newChipKeys={['Enter', ',', ' ']}
					fullWidth
				/>
			)}
		/>
	);
}


const useStyles = makeStyles((theme) => ({
	chipInput: {
		marginTop: '15px'
	}
}));