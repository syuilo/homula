// ================================================================
// CORE CLASSES
//
// basic ... 基本
// thread ... スレッド形式
// ================================================================

import Character from './character';
import CharsStyleMap from './chars-style-map';

import Token from './compiler/token';
import tokenize from './compiler/tokenizer';
import render from './compiler/render';
import { INamePartToken } from './compiler/rules/name-part-of-serif';

import anchor from './compiler/rules/anchor';
import name from './compiler/rules/name-part-of-serif';

// ----------------------------------------------------------------
// Basic
// ----------------------------------------------------------------

export interface NovelOptions {
	title: string;
	text: string;
	characters: {
		id: string;
		name: string[];
		color: string;
	}[];
}

/**
 * ノベルクラス
 * @class Novel
 */
export class Novel {
	id: string;
	title: string;
	text: string;
	tokens: Token[];
	characters: Character[];
	charactersStyle: CharsStyleMap;

	// type of myself
	type: 'novel';

	constructor(options: NovelOptions) {
		this.text = options.text;
		
		this.characters = options.characters.map(c => {
			return new Character(c);
		});
		
		this.charactersStyle = new CharsStyleMap(this.characters);

		this.tokens = tokenize({
			id: this.id,
			characters: this.characters
		}, this.text, [name]);
	}

	/**
	 * このノベル本文のHTMLを生成します
	 * @method Novel#toHtml
	 */
	public toHtml(): string {
		return render(this.tokens, this.charactersStyle);
	}
	
	/**
	 * このノベル本文のCSSを取得します
	 * @method Novel#getCSS
	 */
	public getCSS(): string {
		return this.charactersStyle.toCSS(this);
	}
	
	/**
	 * キャラクターの統計を取得します
	 * @method Novel#getCharactersStatistics
	 */
	public getCharactersStatistics() {
		const foundCharacters: Character[] = [];

		this.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		
		return calcCharactersStatistics(foundCharacters);
	}
}

// ----------------------------------------------------------------
// Thread
// ----------------------------------------------------------------

export interface ThreadOptions {
	title: string;
	posts: {
		text: string;
	}[];
	characters: {
		id: string;
		name: string[];
		color: string;
	}[];
}

/**
 * ノベルクラス
 * @class Thread
 */
export class Thread {
	id: string;
	title: string;
	posts: {
		text: string;
		tokens: Token[];
	}[];
	characters: Character[];
	charactersStyle: CharsStyleMap;

	// type of myself
	type: 'novel';

	constructor(options: ThreadOptions) {
		const posts = options.posts;
		
		this.characters = options.characters.map(c => {
			return new Character(c);
		});
		
		this.charactersStyle = new CharsStyleMap(this.characters);

		this.posts = posts.map(p => {
			return {
				text: p.text,
				tokens: tokenize({
					id: this.id,
					characters: this.characters
				}, p.text, [anchor, name])
			};
		});
	}

	/**
	 * このノベル本文のHTMLを生成します
	 * @method Thread#toHtml
	 */
	public toHtml(): string[] {
		return this.posts.map(p => render(p.tokens, this.charactersStyle));
	}
	
	/**
	 * このノベル本文のCSSを取得します
	 * @method Thread#getCSS
	 */
	public getCSS(): string {
		return this.charactersStyle.toCSS(this);
	}
	
	/**
	 * キャラクターの統計を取得します
	 * @method Thread#getCharactersStatistics
	 */
	public getCharactersStatistics() {
		const foundCharacters: Character[] = [];

		this.posts.forEach(p => {
			p.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		});
		
		return calcCharactersStatistics(foundCharacters);
	}
}

// ================================================================
// Common
// ================================================================

function calcCharactersStatistics(characters: Character[]): {
	id: string;
	onStageRatio: number;
}[] {
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
