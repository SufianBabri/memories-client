import { queryCache } from 'react-query';
import PostModel from './models/postModel';

export const ALL_POSTS = 'ALL_POSTS';

export function getPost(id: string | null) {
	return queryCache
		.getQueryData<PostModel[]>(ALL_POSTS)
		?.find((p) => p._id === id);
}
