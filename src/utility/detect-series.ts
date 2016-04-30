import Series from './series';
import extractCharacterNamesInText from '../core/extract-character-names-in-text';
import unModifyTitle from '../core/un-modify-title';

import { Novel, Thread, isThread } from '../interfaces';
import World from './world';

/**
 * SSのシリーズを同定します
 * @param world World
 * @param ss SS
 * @return 同定されたシリーズ
 */
export default function(
	world: World,
	novel: Novel | (Thread & {
		posts: {
			isMaster: boolean;
		};
	}),
	isCross: boolean
): Series | Series[] {
	const sources: string[] = [];

	if (isThread(novel)) {
		sources.push.apply(sources,
			// 本文だけ
			novel.posts
			// SEE: https://github.com/Microsoft/TypeScript/issues/7649
			.filter(x => (<any>x).isMaster)
			.map(x => x.text));
	} else {
		sources.push(novel.text);
	}

	// SS内に登場するすべてのキャラクター名(と思われる文字列)を抽出
	const extractedNames =
		extractCharacterNamesInText(
			sources
			// キャラクター名がタイトルに含まれている場合が多い
			// 【安価】のようにタイトルは装飾されていることも多いので非装飾化
			.concat(unModifyTitle(novel.title || ''))
		)
		// 重複は除去
		.filter((x, i, self) => self.indexOf(x) === i);

	// 登場頻度ランキング
	const chart: {
		series: Series;
		found: string[]
	}[] = world.series.map(series => {
		return {
			series: series,
			found: []
		};
	});

	world.characters.forEach(char => {
		char.series.forEach(charSeries => {
			// ランキング内のシリーズコンテキストを取得
			let seriesContext = chart.filter(x => x.series.id === charSeries)[0];

			// キャラがこのSSに登場したらそのキャラのシリーズに+1
			extractedNames.forEach(name => {
				if (!char.match(name)) {
					return;
				}

				// 同じキャラの複数登場よるn重+1防止
				if (seriesContext.found.indexOf(char.id) !== -1) {
					return;
				}

				seriesContext.found.push(char.id);
			});
		});
	});

	// 見つかったキャラクターの多さでソート
	chart.sort((a, b) => a.found.length > b.found.length ? -1 : 1);

	// シリーズが見つかったら
	if (chart[0].found.length > 0) {
		// クロスオーバーかつ第二候補も見つかったら
		if (isCross && chart[1].found.length > 0) {
			return [chart[0].series, chart[1].series];
		}

		// それ以外は最有力候補をシリーズとして断定
		return chart[0].series;
	}

	// タイトル内の【】内の文字列
	const textInBracketsMatch = novel.title.match(/【(.+?)】/g);
	const textInBrackets = textInBracketsMatch === null ? null : textInBracketsMatch
		.map(x => x.trim())
		.map(x => x.substr(1, x.length - 2));

	// 【】内の文字列に一致するシリーズを探す
	const seriesInTitle =
		textInBrackets === null
			? null
			: world.series
				.filter(series =>
					textInBrackets.map(text =>
						series.match(text)
					).indexOf(true) !== -1)
				[0];

	// SSタイトルでシリーズを推定出来たら
	if (seriesInTitle !== undefined && seriesInTitle !== null) {
		return [seriesInTitle];
	}

	// 該当なし(同定失敗)
	return null;
}
