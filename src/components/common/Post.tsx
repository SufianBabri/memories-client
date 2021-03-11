import React from 'react';
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import PostModel from '../../data/models/postModel';
import useDeletePost from '../../data/hooks/useDeletePost';
import useLikePost from '../../data/hooks/useLikePost';
import { useError } from '../../hooks/useSnackbar';
import ActionButton from './ActionButton';

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
				<ActionButton
					ariaLabel="Like"
					label={post.likeCount.toString()}
					tooltip="Like"
					onClick={() => likePost(post)}>
					<ThumbsUpIcon />
				</ActionButton>
				<ActionButton
					ariaLabel="Delete"
					tooltip="Delete"
					onClick={() => deletePost(post)}>
					<DeleteIcon />
				</ActionButton>
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
