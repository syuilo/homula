import Character from './character';
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
	public characters: Character[];
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
	 * @member NovelContextBase.characters
	 */
	public characters: Character[] = null;

	constructor(
		characters: Character[]
	) {
		this.characters = characters;
		this.charMap = new CharMap(characters);
	}
}
