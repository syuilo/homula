/**
 * スレッドタイトル内の括弧(とその中のテキスト)を除去します。
 * @param title タイトル
 * @return 括弧が削除されたタイトル
 */
export default (title: string): string => {
	return title.replace(/【.+?】/, '');
};
