import * as uuid from 'uuid';

import identity from './core/identity';

/**
 * キャラクター
 */
export default class {

	/**
	 * キャラクターを一意に識別できるユニークな文字列
	 */
	public id: string;

	/**
	 * キャラクターの名前、呼び名(作中でこのキャラを指して呼ばれる可能性のある文字列)
	 */
	public name: string[];

	/**
	 * レンダリングに使用されるイメージカラー
	 */
	public color: string;

	/**
	 * キャラクターを初期化します。
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
	 * @return bool
	 */
	public match(q: string): boolean {
		return identity(this, q) !== null;
	}
}
