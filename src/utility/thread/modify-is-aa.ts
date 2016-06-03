const assign = require('assign-deep');

import { Thread } from '../../interfaces';

/**
 * アスキーアートであるかどうかを判定します
 * @param post 投稿
 * @return 判定情報が付加された投稿
 */
export default
	<T extends Thread>
	(novel: T):
	T & {
		posts: {
			isAA: boolean;
		};
	} => {

	novel.posts = novel.posts.map(post => {
		let isAA: boolean;

		// 空行が8行以上存在したらAAではなさそう
		const brankLinesCount = (post.text.match(/\n\n/g) || []).length;
		if (brankLinesCount >= 8) {
			isAA = false;
		}

		// スペースが256個以上あったら
		const spacesCount = (post.text.match(/ |　/g) || []).length;
		if (spacesCount >= 256) {
			isAA = true;
		} else {
			isAA = false;
		}

		return assign(post, {
			isAA: isAA
		});
	});

	return novel;
};
