import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const endpoint = 'posts';

export const fetchPosts = () => axios.get(endpoint);
export const createPost = (newPost: any) => axios.post(endpoint, newPost);
export const updatePost = (id: string, updatedPost: any) =>
	axios.patch(`${endpoint}/${id}`, updatedPost);
export const deletePost = (id: string) => axios.delete(`${endpoint}/${id}`);
export const likePost = (id: string) => axios.patch(`${endpoint}/${id}/like`);
