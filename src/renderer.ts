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

	/**
	 * レンダリングに使用されるキャラクタースタイル
	 * @member Renderer.style
	 */
	public style: CharsStyleMap;

	/**
	 * レンダラーを初期化します。
	 * @constructor
	 * @param style レンダリングに使用するキャラクタースタイル
	 */
	constructor(style: CharsStyleMap) {
		this.style = style;
	}

	/**
	 * 与えられたトークンに基づいてHTMLを生成します。
	 * @method Renderer#render
	 * @param tokens 一連のトークンの配列
	 * @return HTML
	 */
	public render(tokens: Token[]): string {
		return tokens.map(this.renderToken.bind(this)).join('');
	}

	/**
	 * トークンレンダラー振り分け
	 * @method Renderer#renderToken
	 * @private
	 * @param token トークン
	 * @return HTML
	 */
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

	/**
	 * テキスト トークンをレンダリングします。
	 * @method Renderer#renderTextToken
	 * @private
	 * @param token テキスト トークン
	 * @return HTML
	 */
	private renderTextToken(token: Token): string {
		return escape(token.text).replace(/\n/g, '<br>');
	}

	/**
	 * 安価 トークンをレンダリングします。
	 * @method Renderer#renderAnchorToken
	 * @private
	 * @param token 安価 トークン
	 * @return HTML
	 */
	private renderAnchorToken(token: IAnchorToken): string {
		return `<span class=anchor data-target="${token.target}">${escape(token.text)}</span>`;
	}

	/**
	 * セリフ内キャラクター名パート トークンをレンダリングします。
	 * @method Renderer#renderCharacterNameToken
	 * @private
	 * @param token セリフ内キャラクター名パート トークン
	 * @return HTML
	 */
	private renderCharacterNameToken(token: INamePartToken): string {
		const klass = this.style.findById(token.character.id).class;
		return `<b class=${klass}>${escape(token.text)}</b>`;
	}
}
