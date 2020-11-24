export default interface PostModel {
	_id: string;
	title: string;
	message: string;
	tags: string[];
	imageUrl: string;
	creator: string;
	createdAt: string;
	likeCount: number;
}
