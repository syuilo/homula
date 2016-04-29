import extractNamePartInSerif from './extract-name-part-in-serif';

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
}
