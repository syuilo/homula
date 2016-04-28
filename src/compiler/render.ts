import * as escape from 'escape-html';

import Token from './token';
import CharsStyleMap from '../chars-style-map';

export default function(tokens: Token[], style: CharsStyleMap): string {
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
			const klass = style.findById(token.character.id).class;
			return `<b class=${klass}>${escape(token.text)}</b>`;
		default:
			return '';
		}
	}).join('');

	return html;
}
