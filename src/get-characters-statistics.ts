import { Novel, Thread } from './novel';
import Character from './character';
import Token from './tokenizer/token';
import { INamePartToken } from './tokenizer/rules/name-part-of-serif';

/**
 * 対象のSSに登場するキャラクターとその割合を抽出します
 * @param world World
 * @param ss SS
 * @return キャラクター情報と登場の割合を含むオブジェクトの配列
 */
export default function(novel: Novel & { tokens: Token[] } | Thread & { posts: { tokens: Token[] }}): {
	id: string;
	onStageRatio: number;
}[] {
	const foundCharacters: Character[] = [];

	switch (novel.type) {
	case 'novel':
		this.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		break;
	case 'thread':
		(<Thread>novel).posts.forEach(p => {
			p.tokens
			.filter((t: INamePartToken) => t.type === 'character-name')
			.forEach((t: INamePartToken) => {
				foundCharacters.push(t.character);
			});
		});
		break;
	default:
		throw 'unknown type';
	}

	// すべてのキャラの登場回数
	const allCount = foundCharacters.length;

	// 重複したキャラクターを除去
	const uniqueFoundChars =
		foundCharacters
		.filter((x, i, self) =>
			self.map(x => x.id).indexOf(x.id) === i);

	const returns = uniqueFoundChars.map(char => {
		// このキャラが何回登場したか
		const onStageCount =
			foundCharacters.filter(x => x.id.toString() === char.id.toString()).length;

		// このキャラの登場の割合は、(このキャラの登場回数 / すべてのキャラの登場回数) で求める
		const onStageRatio = onStageCount / allCount;

		return {
			id: char.id,
			onStageRatio: onStageRatio
		};
	})
	// 登場頻度で降順ソート
	.sort((a, b) => {
		if (a.onStageRatio > b.onStageRatio) {
			return -1;
		} else if (a.onStageRatio < b.onStageRatio) {
			return 1;
		} else {
			return 0;
		}
	});

	return returns;
}
