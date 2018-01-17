const BaseN = require('basen');
import Character from './character';
import { Novel, Thread } from './novel';

/**
 * HTMLにおけるクラス名の全ての桁で使用可能な文字
 * ※ たとえば 0~9 は先頭には使えないためここには含めない
 * ※ 大文字小文字は区別しない
 */
const htmlclasschars = 'abcdefghijklmnopqrstuvwxyz';

const baseN = new BaseN({
	base: htmlclasschars.split('')
});

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
 */
export default class {
	/**
	 * キャラクター アイテムs
	 */
	public chars: charItem[];

	constructor(characters: Character[]) {
		this.chars = characters.map((c, i) => {
			return {
				id: c.id,
				color: c.color,
				class: baseN.encode(i)
			};
		});
	}

	/**
	 * 指定されたIDを持つキャラクターを取得します
	 */
	public findById(characterId: string): charItem {
		return this.chars.filter(c => c.id === characterId)[0];
	}

	/**
	 * このマップに対応するCSS文字列を生成します
	 */
	public toCSS(novel: Novel | Thread, prefix?: string): string {
		return this.chars
			.map(c => {
				if (prefix == null) {
					return `.${c.class}{color:${c.color}}`;
				} else {
					return `${prefix} .${c.class}{color:${c.color}}`;
				}
			})
			.join('');
	}
}
