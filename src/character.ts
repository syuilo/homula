import identity from './utils/identity';

/**
 * キャラクター
 * @class Character
 */
export default class {
	id: string;
	name: string;
	aliases: string[];
	color: string;

	/**
	 * 名前のアイデンティティがこのキャラクターであるか確認します
	 * @method Character#match
	 */
	public match(q: string): boolean {
		return identity(this, q) !== null;
	}
}
