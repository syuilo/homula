import { Novel, Thread, isThread } from '../interfaces';

/**
 * クロスオーバーであるかどうかを判定します。
 * @param ss SS
 * @return bool
 */
export default(novel: Novel | Thread): boolean => {
	if (isThread(novel)) {
		return (
			find(novel.title, '【クロス', 'クロス】') ||
			find((<Thread>novel).posts[0].text, 'クロス'));
	} else {
		return find(novel.title, '【クロス', 'クロス】');
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
