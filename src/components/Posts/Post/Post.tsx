import React, { useContext } from 'react';
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
} from '@material-ui/core';
import ThumbsUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import useStyles from './styles';
import * as api from '../../../data/api';
import PostModel from '../../../models/postModel';
import { queryCache, useMutation } from 'react-query';
import { ALL_POSTS } from '../../../constants/apiPredicates';
import SnackbarContext from '../../../context/SnackbarContext';

interface Props {
	post: PostModel;
}

const Post = ({ post }: Props) => {
	const classes = useStyles();
	const snackbarContext = useContext(SnackbarContext);

	const [deletePost] = useMutation<void, Error, PostModel, PostModel[]>(
		(post) => api.deletePost(post._id),
		{
			onMutate: () => {
				queryCache.cancelQueries(ALL_POSTS);
				const prev =
					queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

				queryCache.setQueryData<PostModel[]>(ALL_POSTS, (posts) => {
					if (posts === undefined) return [];
					return posts.filter((p) => p._id !== post._id);
				});

				return prev;
			},
			onError: () => {
				console.error('request failed');
				snackbarContext.setContent({
					text: 'Delete action failed',
					type: 'error',
				});
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);
	const [likePost] = useMutation<
		PostModel,
		Error,
		PostModel,
		PostModel | undefined
	>((post) => api.likePost(post._id), {
		onMutate: (updatedPost) => {
			queryCache.cancelQueries(ALL_POSTS);

			const posts = queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];
			const found = posts.find((p) => p._id === updatedPost._id);
			if (!found) {
				console.error('Post not found!');
				return undefined;
			}
			const snapshot = { ...found };

			queryCache.setQueryData<PostModel[]>(ALL_POSTS, function (current) {
				updatedPost.likeCount++;

				if (current === undefined) return [updatedPost];

				return current.map((p) => {
					if (p._id === updatedPost._id) return updatedPost;
					else return p;
				});
			});

			return snapshot;
		},
		onError: (e, post, snapshot) => {
			if (snapshot === undefined) return;

			snackbarContext.setContent({
				text: 'Could not save your like!',
				type: 'error',
			});

			const posts = queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];
			const updatedPosts = posts.map((p) => {
				if (p._id === snapshot._id) return snapshot;
				return p;
			});
			queryCache.setQueryData<PostModel[]>(ALL_POSTS, updatedPosts);
		},
		onSuccess: (post) => {
			const posts = queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

			posts.map((p) => {
				if (p._id === post._id) return post;
				return p;
			});
		},
	});
	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.media}
				image={post.image}
				title={post.title}
			/>
			<div className={classes.overlay}>
				<Typography variant="h6">{post.creator}</Typography>
				<Typography variant="body2">
					{moment(post.createdAt).fromNow()}
				</Typography>
			</div>
			<div className={classes.details}>
				<Typography variant="body2" color="textSecondary">
					{post.tags.map((tag: string) => `#${tag} `)}
				</Typography>
			</div>
			<Typography className={classes.title} variant="h5" gutterBottom>
				{post.title}
			</Typography>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{post.message}
				</Typography>
			</CardContent>
			<CardActions className={classes.cardActions}>
				<Button
					size="small"
					color="primary"
					onClick={() => {
						likePost(post);
					}}>
					<ThumbsUpAltIcon fontSize="small" />
					&nbsp; Like &nbsp;
					{post.likeCount}
				</Button>
				<Button
					size="small"
					color="primary"
					onClick={() => deletePost(post)}>
					<DeleteIcon fontSize="small" />
					&nbsp; Delete
				</Button>
			</CardActions>
		</Card>
	);
};

export default Post;
