import axios from 'axios';
import PostDto from '../dto/postDto';
import PostModel from '../models/postModel';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const endpoint = 'posts';

export async function fetchPosts(cachedPosts: PostModel[]) {
	const res = await axios.get<PostModel[]>(endpoint);
	if (res.status === 304) return cachedPosts;

	return res['data'];
}

export async function createPost(newPost: PostDto) {
	const { data } = await axios.post<PostModel>(endpoint, newPost);
	return data;
}

export async function updatePost(id: string, updatedPost: PostDto) {
	const { data } = await axios.patch<PostModel>(
		`${endpoint}/${id}`,
		updatedPost
	);
	return data;
}

export async function deletePost(id: string) {
	await axios.delete(`${endpoint}/${id}`);
}

export async function likePost(id: string) {
	const { data } = await axios.patch<PostModel>(`${endpoint}/${id}/like`);
	return data;
}
