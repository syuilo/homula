/**
 * カタカナをひらがなに変換します
 * @param {String} str カタカナ
 * @returns {String} ひらがな
 */
export default function(str: string): string {
	return str.replace(/[\u30a1-\u30f6]/g, match => {
		const char = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(char);
	});
}

///**
// * ひらがなをカタカナに変換します
// * @param {String} str ひらがな
// * @returns {String} カタカナ
// */
//function hiraganaToKatagana(str: string): string {
//	return str.replace(/[\u3041-\u3096]/g, match => {
//		const char = match.charCodeAt(0) + 0x60;
//		return String.fromCharCode(char);
//	});
//}
