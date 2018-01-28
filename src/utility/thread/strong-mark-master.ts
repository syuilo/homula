import Character from '../../character';
import Origin from '../origin';

import World from '../world';
import extractNamePartInSerif from '../../core/extract-name-part-in-serif';

/**
 * 本文と思われる投稿をマークします(強)
 * @param world World
 * @param posts 投稿の配列
 * @param origins SSのオリジンのID
 * @return マーク情報が付加された投稿の配列
 */
export default function
	<P extends {
		text: string;
		number: number;
		user: {
			id: string;
			trip: string;
		};
	}>
	(
		world: World,
		posts: P[],
		origins: string[]
	):
	(P & {
		isMaster: boolean;
	})[] {

	// オリジンに登場するキャラクター
	const allchars = world.getAllOriginCharacters(origins);

	// 「オリジンのキャラが登場するSS形式の投稿」かどうか
	//  ￣￣￣￣￣￣￣￣￣￣￣￣￣
	const isSerifses = posts.map(post => {
		return {
			isSerifs: isSerifs(post.text),
			user: post.user
		};
	});

	const masters: P['user'][] = [];

	posts.forEach((post, i) => {
		const user = post.user;

		if (masters.filter(x => x.id === user.id).length !== 0) {
			return;
		}

		// >>1はオーナー
		if (post.number === 1) {
			masters.push(user);
			return;
		}

		// トリップ
		if (user.trip !== null && masters.filter(x => x.trip === user.trip).length !== 0) {
			masters.push(user);
			return;
		}

		// SSの文と思われる投稿を3回以上しているユーザーはIDの変わった>>1(もしくは引き継ぎ)だと判断する
		const textsCount =
			isSerifses
			.filter(x => x.isSerifs && x.user.id === user.id)
			.length;

		if (textsCount >= 3) {
			masters.push(user);
		}
	});

	// スキャン
	posts.forEach(post => {
		const isMaster = (
			masters
			.filter(x => x.id === post.user.id)
			.length
		) !== 0;

		Object.assign(post, {
			isMaster
		});
	});

	return posts as any;

	// 与えられたテキストが「オリジンのキャラが登場するSS形式の」文章であるかどうかを判定します。
	function isSerifs(text: string): boolean {
		const chars: Character[] = [];

		text.split('\n').forEach(line => {
			const name = extractNamePartInSerif(line);

			if (name === null) {
				return;
			}

			allchars.forEach(c => {
				if (c.match(name)) {
					chars.push(c);
				}
			});
		});

		// 登場したキャラが5人以上(同じキャラでも可)の場合
		return chars.length >= 5;
	}
}
