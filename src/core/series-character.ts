import Character from '../character';

/**
 * キャラクター
 * @class SeriesCharacter
 */
export default class extends Character {
	series: string[];

	constructor(options: {
		id?: string;
		name: string[];
		color: string;
		series: string | string[];
	}) {
		super(options);

		this.series = typeof options.series === 'string' ? [options.series] : options.series;
	}
}
