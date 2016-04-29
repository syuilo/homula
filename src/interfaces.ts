export interface Novel {
	id: string;
	title?: string;
	text: string;
}

export interface Thread {
	id: string;
	title?: string;
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
