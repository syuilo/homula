import { INovel } from '../inovel';
import Token from '../token';

export default {
	name: 'anchor',
	exec: exec
};

export interface IAnchorToken extends Token {
	target: string;
}

function exec($: INovel, buffer: string): Token[] {
	const anchorRegExpMatch = buffer.match(/^(>>|＞＞)([\d-]+)/);

	if (anchorRegExpMatch !== null) {
		const anchor = anchorRegExpMatch[0];
		const anchorTarget = anchorRegExpMatch[2];

		const token = createAnchorToken(anchor, anchorTarget);
		return [token];
	} else {
		return null;
	}
}

function createAnchorToken(text: string, target: string): IAnchorToken {
	return {
		type: 'anchor',
		text: text,
		target: target
	};
}
