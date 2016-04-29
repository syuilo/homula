/**
 * シリーズ
 * @class Series
 */
export default class {
	id: string;
	title: string[];

	constructor(options: {
		id: string;
		title: string | string[];
	}) {
		this.id = options.id;
		this.title = typeof options.title === 'string' ? [options.title] : options.title;
	}

	/**
	 * 名前のアイデンティティがこのシリーズであるか確認します
	 * @method Series#match
	 */
	public match(q: string): boolean {
		return this.title.indexOf(q) !== -1;
	}
}
