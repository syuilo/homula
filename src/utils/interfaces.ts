export interface IPost {
	number: number;
	text: string;
	user: IUser;
}

export interface IUser {
	name: string;
	id: string;
}

export interface ISS {
	id: string;
	title: string;
	posts: IPost[];
}

export interface ISeries {
	id: string;
	title: string;
	kana: string;
	aliases: string[];
}

export interface ICharacter {
	id: string;
	name: string;
	kana: string;
	screenName: string;
	aliases: string[];
	color: string;
	series: string[];
}
