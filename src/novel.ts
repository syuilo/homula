import Character from './character';
import Token from './tokenizer/token';
import tokenize from './tokenizer/tokenize';
import NovelBase from './novel-base';
import { NovelContextBase } from './novel-base';
import htmlization from './htmlization';

import anchor from './tokenizer/rules/anchor';
import name from './tokenizer/rules/name-part-of-serif';
import { INamePartToken } from './tokenizer/rules/name-part-of-serif';

/**
 * テキストのみのノベル クラス
 * @class Novel
 */
export default class Novel extends NovelBase {
	public text: string;

	public whoareyou = 'novel';

	public analyze(): NovelContext {
		const tokens = tokenize(this, this.text, [anchor, name]);
		return new NovelContext(this.characters, tokens);
	}
}

/**
 * 解析済みノベル クラス
 * @class NovelContext
 */
export class NovelContext extends NovelContextBase {
	/**
	 * 本文のトークン
	 */
	public tokens: Token[] = null;

	constructor(
		characters: Character[],
		tokens: Token[]
	) {
		super(characters);

		this.tokens = tokens;
	}

	public whoareyou = 'novel';

	public toHtml(): string {
		return htmlization(this, this.tokens, false);
	}

	/**
	 * キャラクターの統計を取得します
	 */
	public getCharactersStatistics(): {
		id: string;
		onStageRatio: number;
	}[] {
		const foundCharacters: Character[] = [];

		this.tokens
		.filter((t: INamePartToken) => t.type === 'character-name')
		.forEach((t: INamePartToken) => {
			foundCharacters.push(t.character);
		});

		// すべてのキャラの登場回数
		const allCount = foundCharacters.length;

		// 重複したキャラクターを除去
		const uniqueFoundChars =
			foundCharacters
			.filter((x, i, self) =>
				self.map(x => x.id).indexOf(x.id) === i);

		const returns = uniqueFoundChars.map(char => {
			// このキャラが何回登場したか
			const onStageCount =
				foundCharacters.filter(x => x.id.toString() === char.id.toString()).length;

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
