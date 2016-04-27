import { ICharacter } from './interfaces';
import NovelBase from './novel-base';
import nSin from './utils/n-sin-generator';

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
	public chars: charItem[];

	constructor(characters: ICharacter[]) {
		this.chars = characters.map((c, i) => {
			return {
				id: c.id,
				color: c.color,
				class: nSin(i, 'abcdefghijklmnopqrstuvwxyz')
			};
		});
	}

	public findById(characterId: string): charItem {
		return this.chars.filter(c => c.id === characterId)[0];
	}

	public toCSS(novel: NovelBase): string {
		return this.chars.map(c => {
			return `[data-id='${novel.id}'] .${c.id}{color:${c.color}}`;
		}).join('');
	}
}
