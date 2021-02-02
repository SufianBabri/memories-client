import { useState } from 'react';
import { queryCache, useMutation } from 'react-query';
import PostModel from '../models/postModel';
import * as api from '../api';
import { ALL_POSTS } from '../cache';
import ApiError from '../ApiError';

export default function useDeletePost() {
	const [error, setError] = useState<ApiError | undefined>();
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

			setError({ message: 'Could not like the post...', error: e });

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

	return {
		likePost: async (data: PostModel) => {
			await likePost(data);
		},
		errorOnLike: error,
	};
}
