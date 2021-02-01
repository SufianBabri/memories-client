import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PostDto from '../../dto/postDto';
import useCreatePost from '../../data/cacheHooks';
import TagInputField from '../TagInputField';
import ImagePicker from '../ImagePicker';

interface IProps {
	open: boolean;
	setOpen(open: boolean): void;
	post?: PostDto;
	showError(msg: string): void;
}

export default function MemoryDialog({ open, setOpen, showError }: IProps) {
	const handleClose = () => setOpen(false);

	const { createPost, errorOnCreatePost } = useCreatePost();

	errorOnCreatePost &&
		console.log('Error while creating post', errorOnCreatePost);

	const postSchema = z.object({
		creator: z.string().nonempty(),
		title: z.string().min(3),
		message: z.string().min(10),
		tags: z.string().array().max(3),
		imageBase64: z.string().nonempty(),
	});
	const {
		register,
		getValues,
		control,
		handleSubmit,
		errors,
		setValue,
	} = useForm({
		resolver: zodResolver(postSchema),
	});

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
						fullWidth
						inputRef={register}
					/>
					<TextField
						name="title"
						error={errors.title !== undefined}
						helperText={errors.title?.message ?? ''}
						variant="outlined"
						label="Title"
						fullWidth
						inputRef={register}
						style={{ marginTop: '15px' }}
					/>
					<TextField
						name="message"
						error={errors.message !== undefined}
						helperText={errors.message?.message ?? ''}
						multiline
						rows={3}
						autoFocus={true}
						variant="outlined"
						label="Message"
						fullWidth
						inputRef={register}
						style={{ marginTop: '15px' }}
					/>
					<TagInputField
						name="tags"
						error={errors.tags}
						maxTagLength={10}
						control={control}
					/>
					<ImagePicker
						name="imageBase64"
						error={errors.imageBase64}
						control={control}
						setValue={setValue}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					onClick={handleSubmit(
						(data) => {
							createPost(data);
							setOpen(false);
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
