/**
 * 十進数を任意の文字列で構成されるn進数文字列に変換します
 * @param seed 十進数数値
 * @return n進数
 */
export default (seed: number, chars: string): string => {
	const n = chars.length;

	if (seed === 0) {
		return chars[0];
	}

	let s = '';

	while (seed > 0) {
		s = chars[seed % n] + s;
		seed = Math.floor(seed / n);
	}

	return s;
}
