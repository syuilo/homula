import { Thread } from '../../interfaces';

/**
 * 本文と思われる投稿をマークします(弱)
 * @param posts 投稿の配列
 * @return マーク情報が付加された投稿の配列
 */
export default function
	<P extends {
		number: number;
		text: string;
		user: {
			id: string;
			trip: string;
		};
	}>
	(posts: P[]):
	(P & {
		isMaster: boolean;
	})[] {

	posts.forEach((post, i) => {
		let isMaster = false;

		// >>1は問答無用で本文
		if (post.number === 1) {
			isMaster = true;
		}

		// >>1とIDが同じだったら本文とみて間違いない
		else if (post.user.id === posts[0].user.id) {
			isMaster = true;
		}

		// トリップ
		else if (post.user.trip !== null && post.user.trip === posts[0].user.trip) {
			isMaster = true;
		}

		// IDが違っても「SS形式の投稿」なら本文の可能性がそれなりに高い
		else if (isSerifs(post.text)) {
			isMaster = true;
		}

		Object.assign(post, {
			isMaster: isMaster
		});
	});

	return posts as any;
}

function isSerifs(text: string): boolean {
	// キャラの台詞と思われる行が5つ以上あったらtrue
	return text
		.split('\n')
		.filter(line => /^(.+?)[「｢『（\(](.+)$/.test(line))
		.length >= 5;
}
