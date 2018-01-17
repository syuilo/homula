import Origin from './origin';
import extractCharacterNamesInText from '../core/extract-character-names-in-text';
import unModifyTitle from '../core/un-modify-title';

import World from './world';

/**
 * SSのオリジンを同定します
 */
export default function(
	world: World,
	title: string,
	text: string,
): Origin[] {
	const isCross = false; // TODO

	// SS内に登場するすべてのキャラクター名(と思われる文字列)を抽出
	const extractedNames =
		extractCharacterNamesInText(
			// キャラクター名がタイトルに含まれている場合が多い
			// 【安価】のようにタイトルは装飾されていることも多いので非装飾化
			unModifyTitle(title || '') + '\n' +
			text
		)
		// 重複は除去
		.filter((x, i, self) => self.indexOf(x) === i);

	// 登場頻度ランキング
	const chart = world.origins.map(origin => ({
		origin: origin,
		found: []
	}));

	world.characters.forEach(char => {
		char.origin.forEach(charOrigin => {
			// ランキング内のオリジンコンテキストを取得
			let originContext = chart.filter(x => x.origin.id === charOrigin)[0];

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

	if (title != null) {
		// タイトル内の【】内の文字列
		const textInBracketsMatch = title.match(/【(.+?)】/g);
		const textInBrackets = textInBracketsMatch === null ? null : textInBracketsMatch
			.map(x => x.trim())
			.map(x => x.substr(1, x.length - 2));

		// 【】内の文字列に一致するオリジンを探す
		const originInTitle =
			textInBrackets === null
				? null
				: world.origins
					.filter(origin =>
						textInBrackets.map(text =>
							origin.match(text)
						).indexOf(true) !== -1)
					[0];

		// SSタイトルでオリジンを推定出来たら
		if (originInTitle !== undefined && originInTitle !== null) {
			return [originInTitle];
		}
	}

	// 該当なし(同定失敗)
	return null;
}
