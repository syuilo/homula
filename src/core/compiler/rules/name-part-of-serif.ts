import Character from '../../../character';
import { INovel } from '../inovel';
import Token from '../token';
import CharacterIdentity from '../../character-identity';
import identity from '../../identity';
import extractNamePart from '../../extract-name-part-in-serif';

export default {
	name: 'name-part-of-serif',
	exec: exec
};

export const fast = {
	name: 'name-part-of-serif',
	exec: fastExec
};

export interface INamePartToken extends Token {
	character: Character;
}

/**
 * キャラ名を複数記述するときの区切り文字の定義
 */
const separators =
	['・', '、', '&', '＆', ' '];

function exec(novel: INovel, buffer: string): Token[] {
	if (novel.characters === null || novel.characters.length === 0) {
		return null;
	}

	const part = extractNamePart(buffer);

	if (part === null) {
		return null;
	}

	const matchChars = novel.characters
		.filter(c => c.match(part));

	// キャラが見つかったら
	if (matchChars.length !== 0) {
		const matchChar = matchChars[0];

		const token = createCharacterNameToken(part, matchChar);
		return [token];
	}

	// === 複数のキャラの発言時に A・B・C のように区切って記述する場合がある ===

	const tokens: Token[] = [];

	const separatorSome = separators.some(separator => {
		// セパレータで分割
		const names = part.split(separator);

		// 区切った中に空文字が含まれていたら(つまり、「、、」などの連続したセパレータが含まれていたら)、
		// それはキャラ名を区切るための表現ではないと判断し中断
		if (names.filter(x => x === '').length > 0) {
			return false;
		}

		if (names.length <= 1) {
			return false;
		}

		const chars: CharacterIdentity[] = [];

		// 区切った各キャラ名に対し合致するキャラを取得
		names.some(n => {
			const matchChars = novel.characters
				.map(c => identity(c, n))
				.filter(id => id !== null);

			if (matchChars.length !== 0) {
				const matchChar = matchChars[0]; // TODO 誰を選択するか
				chars.push(matchChar);
				return false;
			} else {
				return true;
			}
		});

		if (chars.length !== names.length) {
			return false;
		}

		// === 結果を出したら ===

		chars.forEach((id, i) => {
			if (id === null) {
				const textToken = createTextToken(names[i]);
				tokens.push(textToken);
			} else {
				const nameToken = createCharacterNameToken(id.name, id.character);
				tokens.push(nameToken);
			}

			// 末尾の要素以外はセパレータを挿入
			if (i + 1 < chars.length) {
				const separatorToken = createTextToken(separator);
				tokens.push(separatorToken);
			}
		});

		return true;
	});

	// separatorの解析が成功したら終了
	if (separatorSome) {
		return tokens;
	}

	// === 複数のキャラの発言時に まどほむ のように繋げて記述する場合がある ===

	// ただしこの解析は計算量が多いため長い名前は断念する
	if (part.length > 32) {
		return null;
	}

	let chars: CharacterIdentity[] = [];
	let tmpname = part;

	// 文字列内をすべて探索
	for (let i = 1; i < tmpname.length + 1; i++) {
		let candidate: CharacterIdentity = null;

		// 最大の確かさを持つ候補を探索する
		/* Note:
		 * 例えば「あかねあかり」という入力が与えられた場合、最初から探索していくと
		 * まず(赤座 あかりとしての)「あか」が検出される可能性がある(赤座 あかね ではなくてという意味)
		 * その判定を採択すると、残りの入力は「ねあかり」となり、正しい判定ではなくなっていくというのが分かる。
		 * このように、単純に解析を行った結果、キャラクターの同定も間違っているし、区切り方も謝ってしまう。
		 * ─この問題を防ぐために、まず検出時に探索をすぐに打ち切るのではなく、
		 * 全ての可能性を検出して、その中で最も「確かな」解を選択すれば良い。
		 * ここで「確からしさ」の導出が鍵となるが、私は「検出した文字列の長さ」を「確からしさ」として採用した。
		 * そうすることで、「あかねあかり」の入力からまず「あか」と「あかね」が検出され、
		 * 一番長い文字列の解を選択するのであるから、「あかね」解が選択され、残りは「あかり」となり、
		 * 同様に「あかり」に対しても「あか」と「あかり」の候補が検出され、その中から「あかり」が採択されて、
		 * 最終的に「あかね」「あかり」だということが判断でき、正しい解釈を行うことができる。
		 * ─便宜上、このアルゴリズムを syuilo法 と名付けた。
		 * どのような手法にしろ、繋がった名前の解析時には、予め登場するキャラクターが全て把握出来ている必要があり、
		 * この集合から新たなアイデンティティを獲得するのは難しい。
		 * つまり、キャラクター抽出段階では、この対象を解析することは出来ない。
		 */
		for (let j = 1; j < tmpname.length + 1; j++) {
			const part = tmpname.substring(0, j);

			const matchedChars = novel.characters
				.filter(c => c.match(part));

			// キャラが１人見つかったら
			if (matchedChars.length === 1) {
				const matchedChar = matchedChars[0];
				// 候補にする
				candidate = new CharacterIdentity(matchedChar, part);
			}
			// キャラが複数人見つかったら
			else if (matchedChars.length > 1) {
				// TODO: 前後の文脈から判断などする(ただしその場合はキャッシュは使えない)
				const matchedChar = matchedChars[0];
				// 候補にする
				candidate = new CharacterIdentity(matchedChar, part);
			}
		}

		// 候補が見つからなかったらスキップ
		if (candidate === null) {
			continue;
		}

		// 既に同じアイデンティティが登録されていたらスキップ
		if (candidate.find(chars)) {
			continue;
		}

		// アイデンティティ追加
		chars.push(candidate);

		// 切り出し
		tmpname = tmpname.substring(candidate.name.length);

		// スキャナリセット
		i = 0;
	}

	// 埋まったら
	if (chars.map(id => id.name).join('') === part) {
		const tokens = chars.map(id =>
			createCharacterNameToken(id.name, id.character)
		);
		return tokens;
	}

	return null;
}

function fastExec(novel: INovel, buffer: string): Token[] {
	if (novel.characters === null || novel.characters.length === 0) {
		return null;
	}

	const part = extractNamePart(buffer);

	if (part === null) {
		const ind = buffer.indexOf('\n');
		if (ind > 0) {
			return [createTextToken(buffer.substring(0, ind + 1))];
		} else {
			return [createTextToken(buffer)];
		}
	}

	const matchChars = novel.characters
		.filter(c => c.match(part));

	// キャラが見つかったら
	if (matchChars.length !== 0) {
		const matchChar = matchChars[0];

		const token = createCharacterNameToken(part, matchChar);
		return [token];
	}

	const ind = buffer.indexOf('\n');
	if (ind > 0) {
		return [createTextToken(buffer.substring(0, ind + 1))];
	} else {
		return [createTextToken(buffer)];
	}
}

function createTextToken(text: string): Token {
	return {
		type: 'text',
		text: text
	};
}

function createCharacterNameToken(text: string, char: Character): INamePartToken {
	return {
		type: 'character-name',
		text: text,
		character: char
	};
}
