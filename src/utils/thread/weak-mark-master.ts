const assign = require('assign-deep');

import { Thread } from '../../interfaces';

/**
 * 本文と思われる投稿をマークします(弱)
 * @param posts 投稿の配列
 * @return マーク情報が付加された投稿の配列
 */
export default
	<T extends Thread & {
		posts: {
			user: {
				trip: string;
			};
		};
	}>
	(novel: T):
	(T & {
		posts: {
			isMaster: boolean;
		};
	}) => {

	novel.posts.forEach((post, i) => {
		let isMaster = false;

		// >>1は問答無用で本文
		if (post.number === 1) {
			isMaster = true;
		}

		// >>1とIDが同じだったら本文とみて間違いない
		else if (post.user.id === novel.posts[0].user.id) {
			isMaster = true;
		}

		// トリップ
		else if (post.user.trip === novel.posts[0].user.trip) {
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

	return <(T & {
		posts: {
			isMaster: boolean;
		};
	})>novel;
}

function isSerifs(text: string): boolean {
	// キャラの台詞と思われる行が5つ以上あったらtrue
	return text
		.split('\n')
		.filter(line => /^(.+?)[「｢『（\(](.+)$/.test(line))
		.length >= 5;
}
