import extractNamePartInSerif, { fast as fastExtractNamePartInSerif } from './extract-name-part-in-serif';

/**
 * テキストの中のキャラクター名部分をすべて抽出します
 * @param text テキスト
 * @return キャラクター名の配列
 */
export default (text: string | string[]): string[] => {
	if (text === null || text === undefined) {
		throw 'text is null or undefined';
	}

	const texts = typeof text === 'string' ? [text] : text;

	let characters: string[] = [];

	texts.forEach(text => {
		text.split('\n').forEach(x => {
			const name = extractNamePartInSerif(x);
			if (name !== null) {
				characters.push(name);
			}
		});
	});

	return characters;
};

/**
 * テキストの中のキャラクター名部分をすべて抽出します(高速、低精度)
 * @param text テキスト
 * @return キャラクター名の配列
 */
export const fast = (text: string | string[]): string[] => {
	const texts = typeof text === 'string' ? [text] : text;

	let characters: string[] = [];

	texts.forEach(text => {
		text.split('\n').forEach(x => {
			const name = fastExtractNamePartInSerif(x);
			if (name !== null) {
				characters.push(name);
			}
		});
	});

	return characters;
};
