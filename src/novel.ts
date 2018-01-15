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
import Renderer from './renderer';
import { INamePartToken } from './core/compiler/rules/name-part-of-serif';

import anchor from './core/compiler/rules/anchor';
import name from './core/compiler/rules/name-part-of-serif';

/**
 * 本文のみのノベル
 */
export class Novel extends NovelBase {

	// type of myself
	type: 'novel';

	/**
	 * 本文
	 */
	public text: string;

	/**
	 * 本文のトークン
	 */
	private tokens: Token[];

	/**
	 * このノベルを読了するのに要すると予想される時間(minutes)
	 */
	public get time() {
		return this.getTime(this.text);
	}

	/**
	 * ノベルを初期化します。
	 * @param options ノベル情報
	 */
	constructor(options: OptionsBase & {
		text: string;
	}) {
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
	 * @param renderer? レンダラー
	 * @return HTML
	 */
	public toHtml(renderer?: Renderer): string {
		renderer = renderer || new Renderer(this.charactersStyle);
		return renderer.render(this.tokens);
	}

	/**
	 * このノベル本文のCSSを取得します
	 * @return CSS
	 */
	public getCSS(): string {
		return this.charactersStyle.toCSS(this);
	}

	/**
	 * キャラクターの統計を取得します
	 * @return 統計情報
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

/**
 * スレッド形式のノベル
 */
export class Thread extends NovelBase {

	// type of myself
	type: 'thread';

	/**
	 * 投稿
	 */
	public posts: {
		text: string;
		tokens: Token[];
		isMaster: boolean;
	}[];

	/**
	 * ノベルを初期化します。
	 * @param options ノベル情報
	 */
	constructor(options: OptionsBase & {
		posts: {
			text: string;
			isMaster: boolean;
		}[];
	}) {
		super(options);

		const posts = options.posts;

		this.characters = options.characters.map(c => {
			return new Character(c);
		});

		this.charactersStyle = new CharsStyleMap(this.characters);

		this.posts = posts.map(p => ({
			text: p.text,
			isMaster: p.isMaster,
			tokens: tokenize({
				id: this.id,
				characters: this.characters
			}, p.text, [anchor, name])
		}));
	}

	/**
	 * このノベル本文のHTMLを生成します
	 * @param renderer? レンダラー
	 * @return それぞれの投稿のHTML
	 */
	public toHtml(renderer?: Renderer): string[] {
		renderer = renderer || new Renderer(this.charactersStyle);
		return this.posts.map(p => renderer.render(p.tokens));
	}

	/**
	 * このノベル本文のCSSを取得します
	 * @return CSS
	 */
	public getCSS(): string {
		return this.charactersStyle.toCSS(this);
	}

	/**
	 * キャラクターの統計を取得します
	 * @return 統計情報
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

	/**
	 * このノベルを読了するのに要すると予想される時間(minutes)
	 */
	public get time() {
		return this.getTime(this.posts
			.filter(p => p.isMaster)
			.map(p => p.text)
			.join('\n\n'));
	}
}
