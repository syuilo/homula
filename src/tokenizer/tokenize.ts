import NovelBase from '../novel-base';
import Token from './token';

export interface IRule {
	name: string;
	exec: ($: NovelBase, buffer: string) => Token[];
}

/**
 * テキストを解析し、トークン列を取得します
 * @param
 * @return IToken[]
 */
export default function($: NovelBase, buffer: string, rules: IRule[]): Token[] {
	const tokens: Token[] = [];

	if (buffer === '') {
		return [createTextToken('')];
	}

	while (buffer !== '') {
		rules.some(rule => {
			const tokens = rule.exec($, buffer);
			if (tokens !== null) {
				tokens.forEach(pushToken);
				return true;
			} else {
				return false;
			}
		});
	}

	function pushToken(token: Token): void {
		// Join text token
		if (token.type === 'text' && tokens.length !== 0 && tokens[tokens.length - 1].type === 'text') {
			tokens[tokens.length - 1].text += token.text;
		} else {
			tokens.push(token);
		}

		buffer = buffer.substring(token.text.length);
	}

	return tokens;
}

function createTextToken(text: string): Token {
	return {
		type: 'text',
		text: text
	};
}
