import Character from '../character';

/**
 * キャラクター
 */
export default class extends Character {
	/**
	 * キャラクターの所属するオリジン(作品)
	 */
	public origin: string[];

	constructor(options: {
		id?: string;
		name: string[];
		color: string;
		origin: string | string[];
	}) {
		super(options);

		this.origin = typeof options.origin === 'string' ? [options.origin] : options.origin;
	}
}
