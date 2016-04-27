import { Post } from '../../thread-novel';

// SEE: http://dic.nicovideo.jp/a/%E3%83%88%E3%83%AA%E3%83%83%E3%83%97#h2-2
const tripSymbol = '◆';

/**
 * 投稿のトリップ情報を取得します
 * @param post 投稿
 * @return トリップ
 */
export default(post: Post): string => {

	let trip: string;

	if (post.user.name.indexOf(tripSymbol) !== -1) {
		trip = post.user.name.split(tripSymbol)[1];
	} else {
		trip = null;
	}

	return trip;
}
