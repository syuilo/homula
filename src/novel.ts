// ================================================================
// CORE CLASSES
//
// basic ... 基本
// thread ... スレッド形式
// ================================================================

import Character from './character';

import Token from './core/compiler/token';
import tokenize from './core/compiler/tokenizer';
import { SimpleRenderer } from './renderer';
import { INamePartToken } from './core/compiler/rules/name-part-of-serif';

import anchor from './core/compiler/rules/anchor';
import name, { fast as fastName } from './core/compiler/rules/name-part-of-serif';

export interface OptionsBase {
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
 */
export abstract class NovelBase {
	abstract type: string;

	/**
	 * ノベル タイトル
	 */
	public title: string;

	/**
	 * 登場人物
	 */
	public characters: Character[];

	public abstract toHtml();

	/**
	 * ノベルを初期化します。
	 * @param options ノベル情報
	 */
	constructor(options: OptionsBase) {
		this.title = options.title || null;
	}

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

/**
 * 本文のみのノベル
 */
export class Novel extends NovelBase {

	// type of myself
	type: 'novel' = 'novel';

	/**
	 * 本文
	 */
	public text: string;

	/**
	 * 本文のトークン
	 */
	public tokens: Token[];

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

		this.tokens = tokenize({
			characters: this.characters
		}, this.text, [name]);
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

	public toHtml() {
		const renderer = new SimpleRenderer(this);
		return renderer.render();
	}
}

/**
 * スレッド形式のノベル
 */
export class Thread extends NovelBase {

	// type of myself
	type: 'thread' = 'thread';

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
		fast?: boolean;
	}) {
		super(options);

		const posts = options.posts;
		const fast = options.fast;

		this.characters = options.characters.map(c => {
			return new Character(c);
		});

		this.posts = posts.map(p => {
			const rules = [];

			if (!fast) rules.push(anchor);
			if (p.isMaster) rules.push(fast ? fastName : name);

			return {
				text: p.text,
				isMaster: p.isMaster,
				tokens: tokenize({
					characters: this.characters
				}, p.text, rules)
			};
		});
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

	public toHtml() {
		const renderer = new SimpleRenderer(this);
		return renderer.render();
	}
}
