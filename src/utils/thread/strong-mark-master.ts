const assign = require('assign-deep');

import Character from '../../character';
import Series from '../series';
import { Thread, ThreadPostUser } from '../../interfaces';

import World from '../world';
import extractNamePartInSerif from '../extract-name-part-in-serif';

/**
 * 本文と思われる投稿をマークします(強)
 * @param world World
 * @param posts 投稿の配列
 * @param series シリーズ
 * @return マーク情報が付加された投稿の配列
 */
export default
	<T extends Thread & {
		posts: {
			user: {
				trip: string;
			};
		};
		series: Series[];
	}>
	(
		world: World,
		novel: T
	):
	(
		T & {
			posts: {
				isMaster: boolean;
			};
		}
	)[] => {

	// シリーズに登場するキャラクター
	const allchars = world.getAllSeriesCharacters(novel.series);

	// 「シリーズのキャラが登場するSS形式の投稿」かどうか
	//  ￣￣￣￣￣￣￣￣￣￣￣￣￣
	const isSerifses = novel.posts.map(post => {
		return {
			isSerifs: isSerifs(post.text),
			user: post.user
		};
	});

	const masters: (ThreadPostUser & { trip: string; })[] = [];

	novel.posts.forEach((post, i) => {
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
	novel.posts = novel.posts.map(post => {
		const isMaster = (
			masters
			.filter(x => x.id === post.user.id)
			.length
		) !== 0;

		return assign(post, {
			isMaster
		});
	});

	return novel;

	// 与えられたテキストが「シリーズのキャラが登場するSS形式の」文章であるかどうかを判定します。
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
