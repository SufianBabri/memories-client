import * as api from '../api';
import { CREATE, UPDATE, FETCH_ALL, DELETE } from '../constants/actionTypes';

export const likePost = (id: string) => async (dispatch: any) => {
	try {
		const { data } = await api.likePost(id);

		dispatch({ type: UPDATE, payload: data });
	} catch (error) {
		console.log(error);
	}
};
