/**
 * セリフに用いられる括弧の定義
 */
const brackets = [
	'「', // 通常のセリフ
	'｢', // ヽ
	'『', // 回想中のセリフ、電話越しのセリフ、テレパシーなど
	'《', // ヽ
	'≪', // ヽ
	'（', // 思惟や心の中で思ったことなど
	'(' // ヽ
];

const bracketsExp =
	brackets
	.map(b => `\\${b}`)
	.join('|');

const serifRegExp = new RegExp(
	`^(([^${bracketsExp}|\n]+?)([（\(][^${bracketsExp}|\n]+?[）\)])?)(${bracketsExp}).+`);

/**
 * セリフ行の中のキャラクター名部分を抽出します
 * @param serif セリフ
 * @return キャラクター名部分
 */
export default (serif: string): string => {
	if (serif === null || serif === undefined) {
		throw 'serif is null or undefined';
	}

	if (serif === '') {
		return null;
	}

	const serifRegExpMatch =
		serif.match(serifRegExp);

	if (serifRegExpMatch !== null) {
		return serifRegExpMatch[1];
	}

	return null;
};

/**
 * セリフ行の中のキャラクター名部分を抽出します(高速、低精度)
 * @param serif セリフ
 * @return キャラクター名部分
 */
export const fast = (serif: string): string => {
	if (serif === '') {
		return null;
	}

	const i = serif.indexOf('「');
	const n = serif.indexOf('\n');

	if (n > -1 && n < i) return null;

	if (i > -1) {
		return serif.substring(0, i);
	} else {
		return null;
	}
};
