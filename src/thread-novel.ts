import NovelBase from './novel-base';

export default class ThreadNovel extends NovelBase {
	public posts: {
		isMaster: boolean;
		text: string;
	}[];
}
