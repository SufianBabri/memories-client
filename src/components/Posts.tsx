import React from 'react';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-query';
import Post from './Post';
import { fetchPosts } from '../data/api';
import { ALL_POSTS } from '../data/cache';

export default function Posts() {
	const classes = useStyles();
	const { data, status } = useQuery(ALL_POSTS, fetchPosts, { retry: 3 });

	if (status === 'loading' || data === undefined)
		return (
			<Grid container justify="center" style={{ paddingTop: 50 }}>
				<CircularProgress style={{ alignItems: 'center' }} />
			</Grid>
		);
	else if (status === 'error') {
		return (
			<Typography variant="h5" align="center" color="error">
				Error fetching data
			</Typography>
		);
	} else if (status === 'success' && data?.length === 0) {
		return (
			<Typography variant="h5" align="center" style={{ color: 'white' }}>
				No memories added yet!
			</Typography>
		);
	} else {
		return (
			<Grid
				className={classes.mainContainer}
				container
				alignItems="stretch"
				spacing={3}>
				{data.map((post) => (
					<Grid key={post._id} item xs={12} sm={6}>
						<Post post={post} />
					</Grid>
				))}
			</Grid>
		);
	}
}

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	smMargin: {
		margin: theme.spacing(1),
	},
	actionDiv: {
		textAlign: 'center',
	},
}));
