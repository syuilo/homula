import Series from './core/series';
import Character from './core/series-character';

/**
 * シリーズとキャラクター情報のデータベース
 * @class World
 */
export default class {

	public series: Series[];

	public characters: Character[];

	constructor(series: {
		id: string;
		title: string | string[];
	}[], characters: {
		id: string;
		name: string[];
		color: string;
		series: string | string[];
	}[]) {
		this.series = series.map(s => {
			return new Series(s);
		});

		this.characters = characters.map(c => {
			return new Character(c);
		});
	}

	/**
	 * 与えられたシリーズに登場するキャラクターを取得します。
	 * @param series シリーズ
	 * @method World#getAllSeriesCharacters
	 */
	public getAllSeriesCharacters(series: Series[]): Character[] {
		return this.characters.filter(c => {
			let found = false;

			series.forEach(series => {
				if (c.series.indexOf(series.id) !== -1) {
					found = true;
				}
			});

			return found;
		});
	}
}
