const assign = require('assign-deep');

// SEE: http://dic.nicovideo.jp/a/%E3%83%88%E3%83%AA%E3%83%83%E3%83%97#h2-2
const tripSymbol: string = '◆';

/**
 * 投稿に投稿のトリップ情報を付加します
 * @param post 投稿
 * @return トリップ情報が付加された投稿
 */
export default function
	<P extends {
		user: {
			name: string;
		};
	}>
	(post: P):
	P & {
		user: {
			trip: string;
		};
	} {

	let trip: string;

	if (post.user.name.indexOf(tripSymbol) !== -1) {
		trip = post.user.name.split(tripSymbol)[1];
	} else {
		trip = null;
	}

	return assign(post, {
		user: {
			trip: trip
		}
	});
}
