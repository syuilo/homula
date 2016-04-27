import { ICharacter } from './interfaces';
import CharMap from './charmap';

// SEE: https://github.com/Microsoft/TypeScript/issues/8307
export default NovelBase;

/**
 * ノベルの基底クラス
 * @class NovelBase
 */
abstract class NovelBase {
	public whoareyou: string;

	public id: string;
	public title: string;
	public isCross: boolean;
	public characters: ICharacter[];
}

/**
 * 解析済みノベルの基底クラス
 * @class NovelContextBase
 */
export abstract class NovelContextBase {
	public whoareyou: string;

	public charMap: CharMap;

	/**
	 * このSSに登場するキャラクター
	 */
	public characters: ICharacter[] = null;

	constructor(
		characters: ICharacter[]
	) {
		this.characters = characters;
		this.charMap = new CharMap(characters);
	}
}
