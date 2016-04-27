import NovelBase from './novel-base';

export interface Post {
	number: number;
	isMaster: boolean;
	text: string;
	user: {
		name: string;
		id: string;
		backgroundColor: string;
		foregroundColor: string
	};
}

export default class ThreadNovel extends NovelBase {
	public posts: Post[];
}
