import * as uuid from 'node-uuid';

import identity from './utils/identity';

/**
 * キャラクター
 * @class Character
 */
export default class {
	id: string;
	name: string[];
	color: string;

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
	 */
	public match(q: string): boolean {
		return identity(this, q) !== null;
	}
}
