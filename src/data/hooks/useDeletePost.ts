import { useState } from 'react';
import { queryCache, useMutation } from 'react-query';
import { ALL_POSTS } from '../../constants/apiPredicates';
import PostModel from '../../models/postModel';
import * as api from '../api';
import ApiError from './ApiError';

export default function useDeletePost() {
	const [error, setError] = useState<ApiError | undefined>();
	const [deletePost] = useMutation<void, Error, PostModel, PostModel[]>(
		(post) => api.deletePost(post._id),
		{
			onMutate: (post) => {
				queryCache.cancelQueries(ALL_POSTS);
				const prev =
					queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

				queryCache.setQueryData<PostModel[]>(ALL_POSTS, (posts) => {
					if (posts === undefined) return [];
					return posts.filter((p) => p._id !== post._id);
				});

				return prev;
			},
			onError: (e) => {
				setError({
					message: 'Error occurred while deleting the post...',
					error: e,
				});
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);

	return {
		deletePost: async (data: PostModel) => {
			await deletePost(data);
		},
		errorOnDelete: error,
	};
}
