import { ISeries, ICharacter } from './interfaces';

/**
 * シリーズとキャラクター情報のデータベース
 * @class World
 */
export default class World {

	public series: ISeries[];

	public characters: ICharacter[];

	constructor(series: ISeries[], characters: ICharacter[]) {
		this.series = series;
		this.characters = characters;
	}

	/**
	 * 与えられたシリーズに登場するキャラクターを取得します。
	 * @param series シリーズ
	 * @method World#getAllSeriesCharacters
	 */
	public getAllSeriesCharacters(series: ISeries[]): ICharacter[] {
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
