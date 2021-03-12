import {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@material-ui/core';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import TagInputField from '../common/TagInputField';
import ImagePicker from '../common/ImagePicker';
import PostDto from '../../data/dto/postDto';
import {useError} from '../../hooks/useSnackbar';
import useCreatePost from '../../data/hooks/useCreatePost';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
	open: boolean;

	setOpen(open: boolean): void;

	post?: PostDto;

	showError(msg: string): void;
}

export default function NewMemoryDialog({open, setOpen, showError}: Props) {
	const [imageData, setImageData] = useState('');
	const {createPost, errorOnCreate} = useCreatePost();
	useError(errorOnCreate);
	const classes = useStyles();

	const handleClose = () => {
		setImageData('');
		setOpen(false);
	};

	const postSchema = z.object({
		creator: z.string().nonempty(),
		title: z.string().min(3),
		message: z.string().min(10),
		tags: z.string().array().max(3, 'A maximum of 3 tags are allowed'),
		imageBase64: z.string().nonempty('You need to upload an image!')
	});

	const {
		register,
		getValues,
		control,
		handleSubmit,
		errors,
		setValue
	} = useForm({
		resolver: zodResolver(postSchema)
	});

	function handleImageUpdate(imageData: string) {
		setImageData(imageData);
		setValue('imageBase64', imageData, {shouldValidate: true});
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title">
			<DialogTitle id="alert-dialog-title">Publish a Memory</DialogTitle>
			<DialogContent>
				<form autoComplete="off" noValidate>
					<TextField
						name="creator"
						error={errors.creator !== undefined}
						helperText={errors.creator?.message ?? ''}
						variant="outlined"
						label="Creator"
						autoFocus={true}
						fullWidth
						inputRef={register}
					/>
					<TextField
						className={classes.topMargin}
						name="title"
						error={errors.title !== undefined}
						helperText={errors.title?.message ?? ''}
						variant="outlined"
						label="Title"
						fullWidth
						inputRef={register}
					/>
					<TextField
						className={classes.topMargin}
						name="message"
						error={errors.message !== undefined}
						helperText={errors.message?.message ?? ''}
						multiline
						rows={3}
						variant="outlined"
						label="Message"
						fullWidth
						inputRef={register}
					/>
					<TagInputField
						name="tags"
						error={errors.tags}
						maxTagLength={10}
						control={control}
					/>
					<ImagePicker
						name="imageBase64"
						imageData={imageData}
						error={errors.imageBase64}
						control={control}
						onUpdate={handleImageUpdate}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					onClick={handleSubmit(
						(data) => {
							setOpen(false);
							createPost(data);
						},
						(e) => {
							console.log('handleSubmit-onError', e);
							console.log(
								'handleSubmit-onError_data',
								getValues()
							);
						}
					)}>
					Publish
				</Button>
			</DialogActions>
		</Dialog>
	);
}
const useStyles = makeStyles((theme) => ({
	topMargin: {
		marginTop: '15px'
	}
}));
