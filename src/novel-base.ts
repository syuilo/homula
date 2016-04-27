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
