import { useState } from 'react';
import { queryCache, useMutation } from 'react-query';
import { ALL_POSTS } from '../constants/apiPredicates';
import PostDto from '../dto/postDto';
import PostModel from '../models/postModel';
import * as api from './api';

export default function useCreatePost() {
	const [error, setError] = useState('');
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
				console.error(e, 'create post failed');
				setError('Error occurred while saving your memory...');
			},
			onSettled: () => {
				queryCache.refetchQueries(ALL_POSTS);
			},
		}
	);
	return {
		createPost: (data: PostDto) => {
			createPost(data).then();
		},
		errorOnCreatePost: error,
	};
}
