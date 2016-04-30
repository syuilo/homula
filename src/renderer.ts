import * as escape from 'escape-html';

import CharsStyleMap from './chars-style-map';

import Token from './core/compiler/token';
import { IAnchorToken } from './core/compiler/rules/anchor';
import { INamePartToken } from './core/compiler/rules/name-part-of-serif';

/**
 * トークンに基づいてHTMLを生成するレンダラー。
 * このクラスを継承して、レンダリングをカスタマイズすることも出来ます
 * @class Renderer
 */
export default class Renderer {
	public style: CharsStyleMap;
	
	constructor(style: CharsStyleMap) {
		this.style = style;
	}
	
	private renderTextToken(token: Token): string {
		return escape(token.text).replace(/\n/g, '<br>');
	}
	
	private renderAnchorToken(token: IAnchorToken): string {
		return `<span class=anchor data-target="${token.target}">${escape(token.text)}</span>`;
	}
	
	private renderCharacterNameToken(token: INamePartToken): string {
		const klass = this.style.findById(token.character.id).class;
		return `<b class=${klass}>${escape(token.text)}</b>`;
	}

	/**
	 * 与えられたトークンに基づいてHTMLを生成します。
	 */
	public render(tokens: Token[]): string {
		return tokens.map(this.renderToken.bind(this)).join('');
	}
	
	private renderToken(token: Token): string {
		switch (token.type) {

		case 'text':
			return this.renderTextToken(token);

		case 'anchor':
			return this.renderAnchorToken(<IAnchorToken>token);

		case 'character-name':
			return this.renderCharacterNameToken(<INamePartToken>token);

		default:
			throw `Unknown token "${token.type}"`;
		}
	}
}