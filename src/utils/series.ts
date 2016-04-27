/**
 * シリーズ
 * @class Series
 */
export default class {
	id: string;
	title: string;
	aliases: string[];

	/**
	 * 名前のアイデンティティがこのシリーズであるか確認します
	 * @method Series#match
	 */
	public match(q: string): boolean {
		return this.title === q || this.aliases.indexOf(q) !== -1;
	}
}
