import React, { useState, useEffect, useContext } from 'react';
import { queryCache, useMutation } from 'react-query';
import {
	TextField,
	Button,
	Typography,
	Paper,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContentText,
	DialogContent,
} from '@material-ui/core';
import useStyles from './styles';
import * as api from '../../api';
import { ALL_POSTS } from '../../constants/apiPredicates';
import PostDto from '../../dto/postDto';
import PostModel from '../../models/postModel';
import SnackbarContext from '../../context/SnackbarContext';

interface Prop {
	currentId: string | null;
	setCurrentId(id: string | null): void;
}

interface UpdateInfo {
	oldPost: PostModel;
	newPost: PostDto;
}

const Form = ({ currentId, setCurrentId }: Prop) => {
	const post = queryCache
		.getQueryData<PostModel[]>(ALL_POSTS)
		?.find((p) => p._id === currentId);
	const snackbarContext = useContext(SnackbarContext);

	useEffect(() => {
		if (post) {
			setPostDto({ ...post, imageBase64: '' });
		}
	}, [post]);

	const [postDto, setPostDto] = useState<PostDto>({
		creator: '',
		title: '',
		message: '',
		tags: [],
		imageBase64: '',
	});
	const [errorDialogOpen, showErrorDialogOpen] = useState(false);
	const classes = useStyles();
	let tempPostDto = { ...postDto };

	const [createPost] = useMutation<PostModel, Error, PostDto, PostModel[]>(
		(postDto) => api.createPost(postDto),
		{
			onMutate: (newPostDto) => {
				queryCache.cancelQueries(ALL_POSTS);
				tempPostDto = { ...postDto };
				clearForm();

				const prev =
					queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

				queryCache.setQueryData<PostModel[]>(
					ALL_POSTS,
					function (current) {
						const tempPostObject = {
							...newPostDto,
							_id: new Date().toISOString(),
							createdAt: new Date().toISOString(),
							imageUrl: newPostDto.imageBase64,
							likeCount: 0,
						};
						if (current === undefined) return [tempPostObject];

						return [...current, tempPostObject];
					}
				);

				return prev;
			},
			onError: (e) => {
				snackbarContext.setSnackbarText(
					'Error occurred while saving your memory...'
				);
				console.error(e);
				Object.assign(postDto, tempPostDto);
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);
	const [updatePost] = useMutation<PostModel, Error, UpdateInfo, PostModel[]>(
		({ oldPost, newPost }) => api.updatePost(oldPost._id, newPost),
		{
			onMutate: (variables) => {
				const { newPost } = variables;
				clearForm();

				queryCache.cancelQueries(ALL_POSTS);
				const prev =
					queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

				queryCache.setQueryData<PostModel[]>(ALL_POSTS, (posts) => {
					if (posts === undefined) {
						const tempPostObject = {
							...newPost,
							_id: new Date().toISOString(),
							createdAt: new Date().toISOString(),
							imageUrl: newPost.imageBase64,
							likeCount: 0,
						};
						return [tempPostObject];
					}

					posts.map((p) => {
						if (p._id === currentId)
							return {
								...newPost,
								_id: new Date().toISOString(),
								createdAt: new Date().toISOString(),
								imageUrl: newPost.imageBase64,
								likeCount: 0,
							};
						else return p;
					});
					return posts;
				});
				return prev;
			},
			onError: (e) => {
				console.error(e);
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();

		const post = currentId
			? queryCache
					.getQueryData<PostModel[]>(ALL_POSTS)
					?.find((p) => p._id === currentId)
			: undefined;

		if (post) {
			updatePost({ oldPost: post, newPost: postDto });
		} else if (postDto.imageBase64.length === 0) {
			snackbarContext.setSnackbarText('Please select an image first!');
		} else {
			createPost(postDto);
		}
	};
	const clearForm = () => {
		setCurrentId(null);
		setPostDto({
			creator: '',
			title: '',
			message: '',
			tags: [],
			imageBase64: '',
		});
		if (imageRef.current) imageRef.current.value = '';
	};

	const closeDialog = () => {
		showErrorDialogOpen(false);
	};

	const onDismiss = () => {
		if (imageRef.current) imageRef.current.value = '';
		closeDialog();
	};

	const getBase64 = (file: File) => {
		const BYTES_IN_ONE_MEGA_BYTE = 1000000;
		if (file.size > 2 * BYTES_IN_ONE_MEGA_BYTE) {
			showErrorDialogOpen(true);
			return;
		}
		let reader = new FileReader();
		reader.onload = function () {
			setPostDto({
				...postDto,
				imageBase64: reader.result?.toString() ?? '',
			});
		};
		reader.onerror = function (error) {
			console.error(error);
		};
		reader.readAsDataURL(file);
	};

	const imageRef = React.useRef<HTMLInputElement>(null);
	return (
		<Paper className={classes.paper}>
			<form
				autoComplete="off"
				noValidate
				className={`${classes.root} ${classes.form}`}
				onSubmit={handleSubmit}>
				<Typography variant="h6">
					{currentId ? 'Editing' : 'Creating'} a Memory
				</Typography>
				<TextField
					name="creator"
					variant="outlined"
					label="Creator"
					fullWidth
					value={postDto.creator}
					onChange={(e) =>
						setPostDto({ ...postDto, creator: e.target.value })
					}
				/>
				<TextField
					name="title"
					variant="outlined"
					label="Title"
					fullWidth
					value={postDto.title}
					onChange={(e) =>
						setPostDto({ ...postDto, title: e.target.value })
					}
				/>
				<TextField
					name="message"
					variant="outlined"
					label="Message"
					fullWidth
					value={postDto.message}
					onChange={(e) =>
						setPostDto({ ...postDto, message: e.target.value })
					}
				/>
				<TextField
					name="tags"
					variant="outlined"
					label="Tags"
					fullWidth
					value={postDto.tags}
					onChange={(e) =>
						setPostDto({
							...postDto,
							tags: e.target.value.split(','),
						})
					}
				/>
				<div className={classes.fileInput}>
					<input
						type="file"
						accept="image/*"
						ref={imageRef}
						alt="Submit"
						onChange={(e) => {
							const files = e.target.files;
							if (files && files.length !== 0) {
								getBase64(files[0]);
							}
						}}
					/>
					<Typography>(Max filesize = 2MB)</Typography>
				</div>
				<Button
					className={classes.buttonSubmit}
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					fullWidth>
					Submit
				</Button>
				<Button
					className={classes.buttonSubmit}
					variant="contained"
					color="secondary"
					size="small"
					onClick={clearForm}
					fullWidth>
					Clear
				</Button>
			</form>
			<Dialog
				open={errorDialogOpen}
				onClose={closeDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">
					File is too large!
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{'Please select a file which is no bigger than 2MB'}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onDismiss} color="primary" autoFocus>
						Dismiss
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
};

export default Form;
