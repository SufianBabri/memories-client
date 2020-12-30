import React from 'react';
import Post from './Post/Post';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { useQuery } from 'react-query';
import { fetchPosts } from '../../api';
import { ALL_POSTS } from '../../constants/apiPredicates';
import useStyles from './styles';

interface Props {
	setCurrentId(id: string): void;
}

const Posts = ({ setCurrentId }: Props) => {
	const classes = useStyles();
	const { data, status } = useQuery(ALL_POSTS, fetchPosts, {
		keepPreviousData: true,
	});

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
						<Post post={post} setCurrentId={setCurrentId} />
					</Grid>
				))}
			</Grid>
		);
	}
};

export default Posts;
