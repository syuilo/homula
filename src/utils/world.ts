import Series from './series';
import Character from './series-character';

/**
 * シリーズとキャラクター情報のデータベース
 * @class World
 */
export default class World {

	public series: Series[];

	public characters: Character[];

	constructor(series: Series[], characters: Character[]) {
		this.series = series;
		this.characters = characters;
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
