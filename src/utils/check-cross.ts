import Novel from '../novel';
import ThreadNovel from '../thread-novel';

/**
 * クロスオーバーであるかどうかを判定します。
 * @param ss SS
 * @return bool
 */
export default(novel: Novel | ThreadNovel): boolean => {
	switch (novel.whoareyou) {
	case 'novel':
		return find(novel.title, '【クロス', 'クロス】');
	case 'thread-novel':
		return (
			find(novel.title, '【クロス', 'クロス】') ||
			find((<ThreadNovel>novel).posts[0].text, 'クロス'));
	default:
		throw 'unknown type';
	}

	function find(target: string, ...xs: string[]): boolean {
		for (let i = 0; i < xs.length; i++) {
			const x = xs[i];
			if (target.indexOf(x) > -1) {
				return true;
			}
		}

		return false;
	}
}
