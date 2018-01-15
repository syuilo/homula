//////////////////////////////////////////////////
// NOVEL BASE
//////////////////////////////////////////////////

import Character from './character';
import CharsStyleMap from './chars-style-map';
import Renderer from './renderer';

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
	public id: string;

	/**
	 * ノベル タイトル
	 */
	public title: string;

	/**
	 * 登場人物
	 */
	public characters: Character[];

	/**
	 * レンダリングに使用されるキャラクタースタイル
	 */
	public charactersStyle: CharsStyleMap;

	/**
	 * ノベルを初期化します。
	 * @param options ノベル情報
	 */
	constructor(options: OptionsBase) {
		this.id = options.id === undefined ? null : options.id;

		this.title = options.title || null;
	}

	abstract toHtml(renderer?: Renderer): any;

	abstract getCSS(): string;

	abstract getCharactersStatistics(): CharactersStatistics;

	/**
	 * キャラクターの統計を計算します
	 * @param characters 対象の全てのキャラクター
	 * @return 統計情報
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

	/**
	 * ノベルを読了するのに要すると予想される時間を取得します(minutes)
	 */
	protected getTime(text: string) {
		return Math.floor(text.length / 18) / 60;
	}
}
