export interface Novel {
	id: string;
	title: string;
	text: string;
}

export interface Thread {
	id: string;
	title: string;
	posts: {
		number: number;
		text: string;
		user: {
			name: string;
			id: string;
		};
	}[];
}

export function isThread(novel: any): novel is Thread {
	return novel.posts !== undefined;
}