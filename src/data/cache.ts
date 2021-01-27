import { queryCache } from 'react-query';
import { ALL_POSTS } from '../constants/apiPredicates';
import PostModel from '../models/postModel';

export function getPost(id: string | null) {
	return queryCache
		.getQueryData<PostModel[]>(ALL_POSTS)
		?.find((p) => p._id === id);
}
