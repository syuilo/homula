//////////////////////////////////////////////////
// NOVEL BASE
//////////////////////////////////////////////////

import Character from './character';
import CharsStyleMap from './chars-style-map';

export interface OptionsBase {
	id?: string;
	title?: string;
	characters: {
		id?: string;
		name: string[];
		color: string;
	}[];
}

export type CharactersStatistics = {
	id: string;
	onStageRatio: number;
}[];

/**
 * ノベル基底クラス
 * @class NovelBase
 */
export abstract class NovelBase {
	id: string;
	title: string;
	characters: Character[];
	charactersStyle: CharsStyleMap;

	constructor(options: OptionsBase) {
		this.id = options.id === undefined ? null : options.id;

		this.title = options.title || null;
	}

	/**
	 * キャラクターの統計を計算します
	 */
	protected calcCharactersStatistics(characters: Character[]): CharactersStatistics {
		// すべてのキャラの登場回数
		const allCount = characters.length;

		// 重複したキャラクターを除去
		const uniqueFoundChars =
			characters
			.filter((c, i, self) =>
				self.map(c => c.id).indexOf(c.id) === i);

		const returns = uniqueFoundChars.map(char => {
			// このキャラが何回登場したか
			const onStageCount =
				characters.filter(c => c.id.toString() === char.id.toString()).length;

			// このキャラの登場の割合は、(このキャラの登場回数 / すべてのキャラの登場回数) で求める
			const onStageRatio = onStageCount / allCount;

			return {
				id: char.id,
				onStageRatio: onStageRatio
			};
		})
		// 登場頻度で降順ソート
		.sort((a, b) => {
			if (a.onStageRatio > b.onStageRatio) {
				return -1;
			} else if (a.onStageRatio < b.onStageRatio) {
				return 1;
			} else {
				return 0;
			}
		});

		return returns;
	}
}
