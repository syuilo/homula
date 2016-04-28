export interface Novel {
	id: string;
	title: string;
	text: string;
	type: 'novel';
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
	type: 'thread';
}
