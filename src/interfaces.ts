export interface NovelBase {
	id: string;
	title?: string;
}

/**
 * 基本的な形式のノベル
 */
export interface Novel extends NovelBase {
	text: string;
}

/**
 * スレッド形式のノベル
 */
export interface Thread extends NovelBase {
	posts: ThreadPost[];
}

export interface ThreadPost {
	number: number;
	text: string;
	user: ThreadPostUser;
}

export interface ThreadPostUser {
	name: string;
	id: string;
}

export function isThread(novel: any): novel is Thread {
	return novel.posts !== undefined;
}
