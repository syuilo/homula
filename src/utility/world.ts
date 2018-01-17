import Origin from './origin';
import Character from '../core/origin-character';

/**
 * オリジンとキャラクター情報のデータベース
 */
export default class {

	public origins: Origin[];

	public characters: Character[];

	constructor(origins: {
		id: string;
		title: string | string[];
	}[], characters: {
		id: string;
		name: string[];
		color: string;
		origin: string | string[];
	}[]) {
		if (origins == null || origins.length == 0) {
			throw 'empty origins'
		}

		if (characters == null || characters.length == 0) {
			throw 'empty characters'
		}

		this.origins = origins.map(s => {
			return new Origin(s);
		});

		this.characters = characters.map(c => {
			return new Character(c);
		});
	}

	/**
	 * 与えられたオリジンに登場するキャラクターを取得します。
	 * @param origins オリジン
	 */
	public getAllOriginCharacters(origins: Origin[]): Character[] {
		return this.characters.filter(c => {
			let found = false;

			origins.forEach(origin => {
				if (c.origin.indexOf(origin.id) !== -1) {
					found = true;
				}
			});

			return found;
		});
	}
}
