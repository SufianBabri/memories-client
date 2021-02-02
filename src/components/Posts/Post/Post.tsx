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
import PostModel from '../../../models/postModel';
import useDeletePost from '../../../data/hooks/useDeletePost';
import useLikePost from '../../../data/hooks/useLikePost';
import { useError } from '../../../hooks/useSnackbar';

interface Props {
	post: PostModel;
}

const Post = ({ post }: Props) => {
	const classes = useStyles();

	const { deletePost, errorOnDelete } = useDeletePost();
	const { likePost, errorOnLike } = useLikePost();

	useError(errorOnDelete);
	useError(errorOnLike);

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
