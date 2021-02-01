import React, { useContext } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import SnackbarContext from '../context/SnackbarContext';
import { Typography } from '@material-ui/core';

interface Props {
	name: string;
	error?: FieldError | undefined;
	control: Control<any>;
	setValue(key: string, value: string): void;
}

export default function ImagePicker({ name, error, control, setValue }: Props) {
	const snackbarContext = useContext(SnackbarContext);

	const isFileSizeAcceptable = (file: File) => {
		const BYTES_IN_ONE_MEGA_BYTE = 1000000;
		return !(file.size > 2 * BYTES_IN_ONE_MEGA_BYTE);
	};
	const readImageAsBase64AndSetValue = (file: File) => {
		if (!isFileSizeAcceptable(file)) {
			snackbarContext.setContent({
				text: 'File size can not exceed 2MB',
				type: 'error',
			});
			return;
		}

		let reader = new FileReader();
		reader.onload = function () {
			setValue('imageBase64', reader.result?.toString() ?? '');
		};
		reader.onerror = function (error) {
			console.error(error);
		};
		reader.readAsDataURL(file);
	};
	return (
		<div
			style={{
				margin: 'auto',
				marginTop: '25px',
				width: '90%',
			}}>
			<Controller
				name={name}
				control={control}
				render={() => (
					<input
						type="file"
						accept="image/*"
						onChange={(e) => {
							const files = e.target.files;
							if (files && files.length !== 0) {
								readImageAsBase64AndSetValue(files[0]);
							}
						}}
					/>
				)}
			/>
			<Typography>(Max filesize = 2MB)</Typography>
			{error && <Typography color="error">{error.message}</Typography>}
		</div>
	);
}
