import React from 'react';
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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import useStyles from './styles';
import * as api from '../../../api';
import PostModel from '../../../models/postModel';
import { queryCache, useMutation } from 'react-query';
import { ALL_POSTS } from '../../../constants/apiPredicates';

interface Props {
	post: PostModel;
	setCurrentId(id: string): void;
}

const Post = ({ post, setCurrentId }: Props) => {
	const classes = useStyles();

	const [deletePost] = useMutation((id: string) => api.deletePost(id), {
		onSuccess: () => {
			queryCache.cancelQueries(ALL_POSTS);

			queryCache.setQueryData<PostModel[]>(ALL_POSTS, (current) => {
				if (current === undefined) return [];
				return current.filter((p) => p._id !== post._id);
			});
		},
	});
	const [likePost] = useMutation((id: string) => api.likePost(id), {
		onSuccess: (updatedPost) => {
			queryCache.cancelQueries(ALL_POSTS);

			queryCache.setQueryData<PostModel[]>(ALL_POSTS, (current) => {
				if (current === undefined) return [updatedPost];
				return current.map((p) => {
					if (p._id === updatedPost._id) return updatedPost;
					else return p;
				});
			});
		},
	});
	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.media}
				image={post.selectedFile}
				title={post.title}
			/>
			<div className={classes.overlay}>
				<Typography variant="h6">{post.creator}</Typography>
				<Typography variant="body2">
					{moment(post.createdAt).fromNow()}
				</Typography>
			</div>
			<div className={classes.overlay2}>
				<Button
					style={{ color: 'white' }}
					size="small"
					onClick={() => setCurrentId(post._id)}>
					<MoreHorizIcon fontSize="default" />
				</Button>
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
						likePost(post._id);
					}}>
					<ThumbsUpAltIcon fontSize="small" />
					&nbsp; Like &nbsp;
					{post.likeCount}
				</Button>
				<Button
					size="small"
					color="primary"
					onClick={() => deletePost(post._id)}>
					<DeleteIcon fontSize="small" />
					&nbsp; Delete
				</Button>
			</CardActions>
		</Card>
	);
};

export default Post;
