import axios from 'axios';
import PostDto from '../dto/postDto';
import PostModel from '../models/postModel';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const endpoint = 'posts';

export async function fetchPosts() {
	const { data } = await axios.get<PostModel[]>(endpoint);
	return data;
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

export const deletePost = (id: string) => axios.delete(`${endpoint}/${id}`);
export const likePost = (id: string) => axios.patch(`${endpoint}/${id}/like`);
