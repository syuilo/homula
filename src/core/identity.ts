import Character from '../character';

import CharacterIdentity from './character-identity';
import removeWhiteSpaces from './string/remove-white-spaces';
import hankakukatakanaToZenkakukatakana from './string/hankakukatakana-to-zenkakukatakana';
import katakanaToHiragana from './string/katakana-to-hiragana';
import zenkakuToHankaku from './string/zenkaku-to-hankaku';

/**
 * 対象のキャラクターと名前からアイデンティティを生成します。
 * @param character 対象のキャラクター
 * @param name 名前
 * @return CharacterIdentity
 */
export default (character: Character, name: string): CharacterIdentity => {
	// 完全一致
	if (match(name)) {
		return instantiation();
	}

	// 括弧付きアイデンティティ
	/* e.g.
	 * 櫻子(幼)
	 *
	 * 状態を表す
	 */
	const bracketsId = test(/[（\(].+?[）\)]/);
	if (bracketsId !== null) {
		return bracketsId;
	}

	// 数字付きアイデンティティ
	/* e.g.
	 * まどか2
	 *
	 * 往々にして複数人に分裂したりする
	 */
	const numberId = test(/([0-9０-９])+$/);
	if (numberId !== null) {
		return numberId;
	}

	// 乗算アイデンティティ
	/* e.g.
	 * 杏子×100
	 *
	 * 往々にして複数人に分裂したりする
	 */
	const timesId = test(/[×x][0-9０-９]+$/);
	if (timesId !== null) {
		return timesId;
	}

	// アルファベット付きアイデンティティ
	/* e.g.
	 * 京子B
	 *
	 * 往々にして複数人に分裂したりする
	 */
	const aluphabetId = test(/[a-zA-Zａ-ｚＡ-Ｚ]+$/);
	if (aluphabetId !== null) {
		return aluphabetId;
	}

	// 諦め
	return null;

	function test(reg: RegExp): CharacterIdentity {
		const idMatch = name.match(reg);
		const id = idMatch !== null ? idMatch[0] : null;

		if (id === null) {
			return null;
		}

		if (match(name.replace(reg, ''))) {
			return instantiation(id);
		} else {
			return null;
		}
	}

	/**
	 * キャラクター名がクエリと合致するか否かを取得します。
	 * @param query クエリ
	 * @return bool
	 */
	function match(query: string): boolean {
		query = normalize(query);
		const names = character.name.map(name => normalize(name));

		return names.indexOf(query) !== -1;
	}

	function instantiation(id?: string): CharacterIdentity {
		if (id !== undefined) {
			return new CharacterIdentity(character, name, id);
		} else {
			return new CharacterIdentity(character, name);
		}
	}
}

function normalize(str: string): string {
	return zenkakuToHankaku(katakanaToHiragana(hankakukatakanaToZenkakukatakana(removeWhiteSpaces(str))));
}
