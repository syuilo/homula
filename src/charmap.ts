import Character from './character';
import NovelBase from './novel-base';
import nSin from './utils/n-sin-generator';

/**
 * HTMLにおけるクラス名の全ての桁で使用可能な文字
 * ※ たとえば 0~9 は先頭には使えないためここには含めない
 * ※ 大文字小文字は区別しない
 */
const htmlclasschars = 'abcdefghijklmnopqrstuvwxyz';

/**
 * キャラクター アイテム
 */
export type charItem = {
	id: string;
	color: string;
	class: string;
};

/**
 * CSS用キャラクターマップクラス
 * @class CharMap
 */
export default class {
	/**
	 * キャラクター アイテムs
	 * @member CharMap.chars
	 */
	public chars: charItem[];

	constructor(characters: Character[]) {
		this.chars = characters.map((c, i) => {
			return {
				id: c.id,
				color: c.color,
				class: nSin(i, htmlclasschars)
			};
		});
	}

	/**
	 * 指定されたIDを持つキャラクターを取得します
	 * @method CharMap#findById
	 */
	public findById(characterId: string): charItem {
		return this.chars.filter(c => c.id === characterId)[0];
	}

	/**
	 * このマップに対応するCSS文字列を生成します
	 * @method CharMap#findById
	 */
	public toCSS(novel: NovelBase): string {
		return this.chars
			.map(c => `[data-id='${novel.id}'] .${c.id}{color:${c.color}}`)
			.join('');
	}
}
