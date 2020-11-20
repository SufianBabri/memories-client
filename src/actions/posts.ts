import * as api from '../api';
import { CREATE, UPDATE, FETCH_ALL, DELETE } from '../constants/actionTypes';

export const createPost = (post: any) => async (dispatch: any) => {
	try {
		const { data } = await api.createPost(post);

		dispatch({ type: CREATE, payload: data });
	} catch (error) {
		console.log(error);
	}
};

export const updatePost = (id: string, post: any) => async (dispatch: any) => {
	try {
		const { data } = await api.updatePost(id, post);

		dispatch({ type: UPDATE, payload: data });
	} catch (error) {
		console.log(error);
	}
};

export const deletePost = (id: string) => async (dispatch: any) => {
	try {
		await api.deletePost(id);

		dispatch({ type: DELETE, payload: id });
	} catch (error) {
		console.log(error);
	}
};

export const likePost = (id: string) => async (dispatch: any) => {
	try {
		const { data } = await api.likePost(id);

		dispatch({ type: UPDATE, payload: data });
	} catch (error) {
		console.log(error);
	}
};
