import * as escape from 'escape-html';

import { NovelContextBase } from './novel-base';
import Token from './tokenizer/token';

export default function(ctx: NovelContextBase, tokens: Token[], isAA: boolean): string {
	if (tokens.length === 0) {
		return null;
	}

	let html = tokens.map((token: any) => {
		switch (token.type) {
		case 'text':
			return escape(token.text).replace(/\n/g, '<br>');
		case 'anchor':
			return `<span class=anchor data-target="${token.target}">${escape(token.text)}</span>`;
		case 'character-name':
			const klass = ctx.charMap.findById(token.character.id).class;
			return `<b class=${klass}>${escape(token.text)}</b>`;
		default:
			return '';
		}
	}).join('');

	if (isAA) {
		html = `<pre>${html}</pre>`;
	}

	return html;
}
