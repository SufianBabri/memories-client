import React from 'react';
import {Button, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
	caption: string;

	onFileSelected(file: File): void;
}

export default function ImageInput({caption, onFileSelected}: Props) {
	const classes = useStyles();

	return (
		<Grid container spacing={1} alignItems="center">
			<Grid item>
				<input
					className={classes.input}
					id="contained-button-file"
					type="file"
					accept="image/*"
					onChange={(e) => {
						const files = e.target.files;
						if (!files || files.length === 0) return;

						onFileSelected(files[0]);
					}}
				/>
				<label htmlFor="contained-button-file">
					<Button component="span" color="primary">
						Upload
					</Button>
				</label>
			</Grid>
			<Grid>
				<Typography variant="caption">{caption}</Typography>
			</Grid>
		</Grid>
	);
}
const useStyles = makeStyles((theme) => ({
	input: {
		display: 'none'
	}
}));