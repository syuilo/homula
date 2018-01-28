import Origin from './origin';
import extractCharacterNamesInText, { fast as fastExtractCharacterNamesInText } from '../core/extract-character-names-in-text';
import unModifyTitle from '../core/un-modify-title';

import World from './world';

export function detectOriginFromTitle(world: World, title: string) {
	let brackets = title.match(/【(.+?)】/g);

	if (brackets && brackets.length > 0) {
		// 【x】-> x
		brackets = brackets.map(b => b.substring(1, b.length - 1).trim());

		const matched = world.origins.filter(o =>
			o.title.some(t =>
				brackets.indexOf(t) > -1 ||
				brackets.indexOf(t + 'SS') > -1 ||
				brackets.indexOf(t + 'ＳＳ') > -1));

		if (matched.length > 0) {
			return matched.map(o => o.id);
		} else {
			return null;
		}
	} else {
		return null;
	}
}

/**
 * SSのオリジンを同定します
 */
export default function(opts: {
	world: World;
	title: string;
	text: string;
	fast?: boolean;
	useTitle?: boolean;
}): string[] {
	const isCross = false; // TODO

	if (opts.useTitle == null) opts.useTitle = true;

	// SS内に登場するすべてのキャラクター名(と思われる文字列)を抽出
	const extractedNames =
		(opts.fast ? fastExtractCharacterNamesInText : extractCharacterNamesInText)(
			// キャラクター名がタイトルに含まれている場合が多い
			// 【安価】のようにタイトルは装飾されていることも多いので非装飾化
			unModifyTitle(opts.title || '') + '\n' +
			opts.text)
		// 重複は除去
		.filter((x, i, self) => self.indexOf(x) === i);

	// 登場頻度ランキング
	const chart = opts.world.origins.map(origin => ({
		origin: origin.id,
		found: []
	}));

	opts.world.characters.forEach(char => {
		char.origin.forEach(charOrigin => {
			// ランキング内のオリジンコンテキストを取得
			let originContext = chart.filter(x => x.origin === charOrigin)[0];

			// キャラがこのSSに登場したらそのキャラのオリジンに+1
			extractedNames.forEach(name => {
				if (!char.match(name)) {
					return;
				}

				// 同じキャラの複数登場よるn重+1防止
				if (originContext.found.indexOf(char.id) !== -1) {
					return;
				}

				originContext.found.push(char.id);
			});
		});
	});

	// 見つかったキャラクターの多さでソート
	chart.sort((a, b) => a.found.length > b.found.length ? -1 : 1);

	// オリジンが見つかったら
	if (chart[0].found.length > 0) {
		// クロスオーバーかつ第二候補も見つかったら
		if (isCross && chart[1].found.length > 0) {
			return [chart[0].origin, chart[1].origin];
		}

		// それ以外は最有力候補をオリジンとして断定
		return [chart[0].origin];
	}

	if (opts.title != null && opts.useTitle) {
		// タイトル内の【】の文字列に一致するオリジンを探す
		const originInTitle = detectOriginFromTitle(opts.world, opts.title);

		// SSタイトルでオリジンを推定出来たら
		if (originInTitle) {
			return originInTitle;
		}
	}

	// 該当なし(同定失敗)
	return null;
}
