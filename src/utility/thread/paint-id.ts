const assign = require('assign-deep');
import * as seedrandom from 'seedrandom';

import { Thread } from '../../interfaces';

/**
 * IDに基づいた背景色と文字色を投稿に付加します
 * @param post 投稿
 * @return IDの背景色と文字色情報が付加された投稿
 */
export default
	<T extends Thread>
	(novel: T):
	T & {
		posts: {
			user: {
				backgroundColor: string;
				foregroundColor: string;
			};
		};
	} => {

	novel.posts = novel.posts.map(post => {

		// 各チャンネルの重み
		const rWeight = 0.298912;
		const gWeight = 0.586611;
		const bWeight = 0.114478;

		// Init randomizer
		const random = seedrandom(post.user.id);

		// 各チャンネルをランダムに決定
		const r = Math.floor(random() * 255);
		const g = Math.floor(random() * 255);
		const b = Math.floor(random() * 255);

		// 輝度(重み付き)
		const luminance = Math.floor(
			rWeight * r + gWeight * g + bWeight * b);

		// 16進数に変換
		const rHex1 = r.toString(16);
		const gHex1 = g.toString(16);
		const bHex1 = b.toString(16);

		// 0埋め
		const rHex2 = `0${rHex1}`.slice(-2);
		const gHex2 = `0${gHex1}`.slice(-2);
		const bHex2 = `0${bHex1}`.slice(-2);

		// フォーマット
		const background = `#${rHex2}${gHex2}${bHex2}`;
		const foreground = luminance > 180 ? '#000' : '#fff';

		return assign(post, {
			user: {
				backgroundColor: background,
				foregroundColor: foreground
			}
		});
	});

	return novel;
};
