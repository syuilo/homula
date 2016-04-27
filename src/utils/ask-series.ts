import { ISeries } from './interfaces';

/**
 * 対象のシリーズがある名前で呼ばれているか否かを取得します。
 * @param series 対象のシリーズ
 * @param title 名前
 * @return bool
 */
export default (series: ISeries, title: string): boolean => {
	return series.title === title || series.aliases.indexOf(title) !== -1;
}
