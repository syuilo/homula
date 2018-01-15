import Origin from './origin';
import Character from '../core/origin-character';

/**
 * オリジンとキャラクター情報のデータベース
 */
export default class {

	public origin: Origin[];

	public characters: Character[];

	constructor(origin: {
		id: string;
		title: string | string[];
	}[], characters: {
		id: string;
		name: string[];
		color: string;
		origin: string | string[];
	}[]) {
		this.origin = origin.map(s => {
			return new Origin(s);
		});

		this.characters = characters.map(c => {
			return new Character(c);
		});
	}

	/**
	 * 与えられたオリジンに登場するキャラクターを取得します。
	 * @param origin オリジン
	 * @method World#getAllOriginCharacters
	 */
	public getAllOriginCharacters(origin: Origin[]): Character[] {
		return this.characters.filter(c => {
			let found = false;

			origin.forEach(origin => {
				if (c.origin.indexOf(origin.id) !== -1) {
					found = true;
				}
			});

			return found;
		});
	}
}
