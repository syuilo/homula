import { ICharacter } from '../interfaces';

/* Note:
 * 単に「ID(アイディー)」と呼ぶとデータベースのインデックスとしてのIDと紛らわしくなるので アイデンティティ と呼びます。
 */

/**
 * キャラクターのアイデンティティを表します。
 * @class CharacterIdentity
 */
export default class CharacterIdentity {

	public character: ICharacter;
	public id: string;
	public name: string;

	constructor(character: ICharacter, name: string);
	constructor(character: ICharacter, name: string, id: string);
	constructor(character: ICharacter, name: string, id?: string) {
		this.character = character;
		this.name = name;

		if (id !== undefined) {
			this.id = id;
		} else {
			this.id = null;
		}
	}

	/**
	 * このキャラクター アイデンティティ インスタンスを表す文字列を取得します。
	 * @method CharacterIdentity#toString
	 * @return string
	 */
	public toString(): string {
		if (this.id !== null) {
			return this.character.id.toString() + this.id;
		} else {
			return this.character.id.toString();
		}
	}

	/**
	 * 与えられたアイデンティティの中に自分と同じアイデンティティがあるか取得します。
	 * @method CharacterIdentity#find
	 * @param identities アイデンティティの配列
	 * @return boolean
	 */
	public find(identities: CharacterIdentity[]): boolean {
		for (let i = 0; i < identities.length; i++) {
			const id = identities[i];
			if (id.toString() === this.toString()) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 2つのアイデンティティ インスタンスが等しいか比較します。
	 * @method CharacterIdentity#equals
	 * @return boolean
	 */
	public equals(charIdentity: CharacterIdentity): boolean {
		return charIdentity.toString() === this.toString();
	}
}
