import { useState } from 'react';
import { queryCache, useMutation } from 'react-query';
import { ALL_POSTS } from '../../constants/apiPredicates';
import PostDto from '../../dto/postDto';
import PostModel from '../../models/postModel';
import * as api from '../api';
import ApiError from './ApiError';

export default function useCreatePost() {
	const [error, setError] = useState<ApiError | undefined>();

	const [createPost] = useMutation<PostModel, Error, PostDto, PostModel[]>(
		(postDto) => api.createPost(postDto),
		{
			onMutate: (newPostDto) => {
				queryCache.cancelQueries(ALL_POSTS);

				const prev =
					queryCache.getQueryData<PostModel[]>(ALL_POSTS) ?? [];

				queryCache.setQueryData<PostModel[]>(
					ALL_POSTS,
					function (current) {
						const tempPostObject = {
							...newPostDto,
							_id: new Date().toISOString(),
							createdAt: new Date().toISOString(),
							image: newPostDto.imageBase64,
							likeCount: 0,
						};
						if (current === undefined) return [tempPostObject];

						return [...current, tempPostObject];
					}
				);

				return prev;
			},
			onError: (e) => {
				setError({
					message: 'Error occurred while posting your memory...',
					error: e,
				});
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);

	return {
		createPost: async (data: PostDto) => {
			await createPost(data);
		},
		errorOnCreate: error,
	};
}
