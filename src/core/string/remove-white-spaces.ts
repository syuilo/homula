/**
 * 文字列内のスペースを除去します
 *
 * @param {String} str
 * @returns {String}
 */
export default function(s: string): string {
	return s.replace(/\s/g, '');
}
