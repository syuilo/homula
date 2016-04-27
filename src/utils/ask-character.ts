import { ICharacter } from '../interfaces';

import identity from './identity';

/**
 * 対象のキャラクターがある名前で呼ばれているか否かを取得します。
 * @param character 対象のキャラクター
 * @param name 名前
 * @return bool
 */
export default (character: ICharacter, name: string): boolean => {
	return identity(character, name) !== null;
}
