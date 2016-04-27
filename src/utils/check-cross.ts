import { ISS } from './interfaces';

/**
 * クロスオーバーであるかどうかを判定します。
 * @param ss SS
 * @return bool
 */
export default(ss: ISS): boolean => {
	return (
		find(ss.title, '【クロス', 'クロス】') ||
		find(ss.posts[0].text, 'クロス'));

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
