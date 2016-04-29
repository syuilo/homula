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
}
