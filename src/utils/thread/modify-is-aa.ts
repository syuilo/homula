/**
 * アスキーアートであるかどうかを判定します
 * @param post 投稿
 * @return bool
 */
export default(text: string): boolean => {

	let isAA: boolean;

	// 空行が8行以上存在したらAAではなさそう
	const brankLinesCount = (text.match(/\n\n/g) || []).length;
	if (brankLinesCount >= 8) {
		isAA = false;
	}

	// スペースが256個以上あったら
	const spacesCount = (text.match(/ |　/g) || []).length;
	if (spacesCount >= 256) {
		isAA = true;
	} else {
		isAA = false;
	}

	return isAA;
}
