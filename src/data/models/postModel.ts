export default interface PostModel {
	_id: string;
	creator: string;
	title: string;
	message: string;
	tags: string[];
	image: string;
	createdAt: string;
	likeCount: number;
}
