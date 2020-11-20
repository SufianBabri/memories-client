export default interface PostModel {
	_id: string;
	title: string;
	message: string;
	tags: string[];
	selectedFile: string;
	creator: string;
	createdAt: string;
	likeCount: string;
}
