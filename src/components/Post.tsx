import React from 'react';
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThumbsUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import PostModel from '../data/models/postModel';
import useDeletePost from '../data/hooks/useDeletePost';
import useLikePost from '../data/hooks/useLikePost';
import { useError } from '../hooks/useSnackbar';

interface Props {
	post: PostModel;
}

export default function Post({ post }: Props) {
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
}

const useStyles = makeStyles({
	media: {
		height: 0,
		paddingTop: '56.25%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		backgroundBlendMode: 'darken',
	},
	border: {
		border: 'solid',
	},
	fullHeightCard: {
		height: '100%',
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderRadius: '15px',
		height: '100%',
		position: 'relative',
	},
	overlay: {
		position: 'absolute',
		top: '20px',
		left: '20px',
		color: 'white',
	},
	overlay2: {
		position: 'absolute',
		top: '20px',
		right: '20px',
		color: 'white',
	},
	grid: {
		display: 'flex',
	},
	details: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: '20px',
	},
	title: {
		padding: '0 16px',
	},
	cardActions: {
		padding: '0 16px 8px 16px',
		display: 'flex',
		justifyContent: 'space-between',
	},
});
