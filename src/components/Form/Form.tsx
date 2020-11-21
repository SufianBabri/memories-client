import React, { useState, useEffect } from 'react';
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
//@ts-ignore
import useStyles from './styles';
import * as api from '../../api';
import { ALL_POSTS } from '../../constants/apiPredicates';
import PostDto from '../../dto/postDto';
import PostModel from '../../models/postModel';

interface Prop {
	currentId: string | null;
	setCurrentId(id: string | null): void;
}

const Form = ({ currentId, setCurrentId }: Prop) => {
	const post = queryCache
		.getQueryData<PostModel[]>(ALL_POSTS)
		?.find((p) => p._id === currentId);

	useEffect(() => {
		if (post) setPostData({ ...post, imageFile: '' });
	}, [post]);

	const [postData, setPostData] = useState<PostDto>({
		creator: '',
		title: '',
		message: '',
		tags: [],
		imageFile: '',
	});
	const [errorDialogOpen, showErrorDialogOpen] = useState(false);
	const classes = useStyles();

	const [createPost] = useMutation(() => api.createPost(postData), {
		onSuccess: (newPost) => {
			queryCache.cancelQueries(ALL_POSTS);

			queryCache.setQueryData<PostModel[]>(ALL_POSTS, (current) => {
				if (current === undefined) return [newPost];
				return [...current, newPost];
			});

			queryCache.refetchQueries(ALL_POSTS);
		},
		onError: (e) => console.error(e),
		onSettled: () => {
			clear();
			queryCache.refetchQueries(ALL_POSTS);
		},
	});
	const [updatePost] = useMutation(
		(id: string) => api.updatePost(id, postData),
		{
			onSuccess: (newPost) => {
				queryCache.cancelQueries(ALL_POSTS);

				queryCache.setQueryData<PostModel[]>(ALL_POSTS, (posts) => {
					if (posts === undefined) return [newPost];
					posts.map((p) => {
						if (p._id === currentId) return newPost;
						else return p;
					});
					return posts;
				});
				queryCache.refetchQueries(ALL_POSTS);
			},
			onError: (e) => console.error(e),
			onSettled: () => {
				clear();
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (currentId) {
			updatePost(currentId);
		} else {
			createPost();
		}
	};
	const clear = () => {
		setCurrentId(null);
		setPostData({
			creator: '',
			title: '',
			message: '',
			tags: [],
			imageFile: '',
		});
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
			setPostData({
				...postData,
				imageFile: reader.result?.toString() ?? '',
			});
		};
		reader.onerror = function (error) {
			console.error(error);
		};
		reader.readAsDataURL(file);
	};

	const imageRef = React.createRef<HTMLInputElement>();
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
					value={postData.creator}
					onChange={(e) =>
						setPostData({ ...postData, creator: e.target.value })
					}
				/>
				<TextField
					name="title"
					variant="outlined"
					label="Title"
					fullWidth
					value={postData.title}
					onChange={(e) =>
						setPostData({ ...postData, title: e.target.value })
					}
				/>
				<TextField
					name="message"
					variant="outlined"
					label="Message"
					fullWidth
					value={postData.message}
					onChange={(e) =>
						setPostData({ ...postData, message: e.target.value })
					}
				/>
				<TextField
					name="tags"
					variant="outlined"
					label="Tags"
					fullWidth
					value={postData.tags}
					onChange={(e) =>
						setPostData({
							...postData,
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
					onClick={clear}
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
