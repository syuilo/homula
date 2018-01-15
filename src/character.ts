import * as uuid from 'uuid';

import identity from './core/identity';

/**
 * キャラクター
 * @class Character
 */
export default class {

	/**
	 * キャラクターを一意に識別できるユニークな文字列
	 * @member Character.id
	 */
	public id: string;

	/**
	 * キャラクターの名前、呼び名(作中でこのキャラを指して呼ばれる可能性のある文字列)
	 * @member Character.name
	 */
	public name: string[];

	/**
	 * レンダリングに使用されるイメージカラー
	 * @member Character.color
	 */
	public color: string;

	/**
	 * キャラクターを初期化します。
	 * @constructor
	 * @param options キャラクタープロフィール
	 */
	constructor(options: {
		id?: string;
		name: string[];
		color: string;
	}) {
		this.id = options.id || uuid.v4();
		this.name = options.name;
		this.color = options.color;
	}

	/**
	 * 名前のアイデンティティがこのキャラクターであるか確認します
	 * @method Character#match
	 * @return bool
	 */
	public match(q: string): boolean {
		return identity(this, q) !== null;
	}
}
