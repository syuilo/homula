/**
 * スレッドがSSかどうかを判定します
 */
export default
	<P extends {
		text: string;
	}>
	(posts: P[]): boolean => {

	if (posts.filter(p => isSerifs(p.text)).length < 5) {
		return false;
	}

	return true;
};

function isSerifs(text: string): boolean {
	// キャラの台詞と思われる行が4つ以上あったらtrue
	return text
		.split('\n')
		.filter(line => /^(.+?)[「｢『（\(](.+)$/.test(line))
		.length >= 4;
}
