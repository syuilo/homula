// ================================================================
// CORE CLASSES
//
// basic ... 基本
// thread ... スレッド形式
// ================================================================

import { NovelBase, OptionsBase, CharactersStatistics } from './novel-base';

import Character from './character';
import CharsStyleMap from './chars-style-map';

import Token from './core/compiler/token';
import tokenize from './core/compiler/tokenizer';
import render from './core/compiler/render';
import { INamePartToken } from './core/compiler/rules/name-part-of-serif';

import anchor from './core/compiler/rules/anchor';
import name from './core/compiler/rules/name-part-of-serif';

// ----------------------------------------------------------------
// Basic
// ----------------------------------------------------------------

export interface NovelOptions extends OptionsBase {
	text: string;
}

/**
 * ノベルクラス
 * @class Novel
 */
export class Novel extends NovelBase {
	text: string;
	tokens: Token[];
	
	// type of myself
	type: 'novel';

	constructor(options: NovelOptions) {
		super(options);

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
	public getCharactersStatistics(): CharactersStatistics {
		const foundCharacters: Character[] = [];

		this.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});

		// タイトル中
		if (this.title !== null) {
			(tokenize(this, this.title, [name]) || [])
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		}

		return this.calcCharactersStatistics(foundCharacters);
	}
}

// ----------------------------------------------------------------
// Thread
// ----------------------------------------------------------------

export interface ThreadOptions extends OptionsBase {
	posts: {
		text: string;
	}[];
}

/**
 * ノベルクラス
 * @class Thread
 */
export class Thread extends NovelBase {
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
		super(options);

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
	public getCharactersStatistics(): CharactersStatistics {
		const foundCharacters: Character[] = [];

		this.posts.forEach(p => {
			p.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		});

		// タイトル中
		if (this.title !== null) {
			(tokenize(this, this.title, [name]) || [])
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		}

		return this.calcCharactersStatistics(foundCharacters);
	}
}
