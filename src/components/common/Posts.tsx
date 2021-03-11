import React from 'react';
import {Button, CircularProgress, Container, Grid, Grow, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useQuery} from 'react-query';
import Post from './Post';
import {fetchPosts} from '../../data/api';
import {ALL_POSTS} from '../../data/cache';

export default function Posts() {
	const classes = useStyles();

	let {data, status, refetch} = useQuery(ALL_POSTS, fetchPosts, {
		retry: 2,
		refetchOnMount: false,
		refetchOnWindowFocus: false
	});

	if (status === 'loading') {
		return (
			<Grid container justify="center" className={classes.progressContainer}>
				<CircularProgress className={classes.progress} />
			</Grid>
		);
	} else if (status === 'success' && data?.length === 0) {
		return (
			<Typography variant="h5" align="center" className={classes.emptyMessageContainer}>
				No memories added yet!
			</Typography>
		);
	} else if (data !== undefined) {
		return (
			<Grow in>
				<Container>
					<Grid
						container
						className={classes.mainContainer}
						spacing={3}
						justify="center">
						{data.map((post) => (
							<Grid
								item
								key={post._id}
								xs={10}
								sm={5}
								lg={4}
								xl={4}>
								<Post post={post} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Grow>
		);
	} else {
		return (
			<Grid
				container
				justify="center"
				className={classes.retryContainer}>
				<Grid item xs={12}>
					<Typography variant="h5" align="center">
						Failed to load the posts. Please try again.
					</Typography>
				</Grid>
				<Grid item className={classes.retryButtonContainer}>
					<Button
						onClick={() => refetch()}
						color="primary"
						variant="contained">
						Retry
					</Button>
				</Grid>
			</Grid>
		);
	}
}

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	progressContainer: {
		paddingTop: 90
	},
	emptyMessageContainer: {
		paddingTop: 50
	},
	progress: {
		alignItems: 'center'
	},
	retryContainer: {
		paddingTop: '50px'
	},
	retryButtonContainer: {
		paddingTop: '10px'
	}
}));
