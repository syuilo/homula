import * as escape from 'escape-html';

import { Novel, Thread } from './novel';
import CharsStyleMap from './chars-style-map';

import Token from './core/compiler/token';
import { IAnchorToken } from './core/compiler/rules/anchor';
import { INamePartToken } from './core/compiler/rules/name-part-of-serif';

/**
 * トークンに基づいてHTMLを生成するレンダラー。
 * このクラスを継承して、レンダリングをカスタマイズすることも出来ます
 */
export default abstract class Renderer {
	protected abstract renderText: (token: Token) => string;
	protected abstract renderAnchor: (token: IAnchorToken) => string;
	protected abstract renderChar: (token: INamePartToken) => string;

	protected novel: Novel | Thread;

	/**
	 * レンダラーを初期化します
	 * @param novel
	 */
	constructor(novel: Novel | Thread) {
		this.novel = novel;
	}

	/**
	 * HTMLを生成します。
	 * @return HTML
	 */
	public render(): string | string[] {
		if (this.novel.type == 'novel') {
			return this.novel.tokens.map(this.renderToken.bind(this)).join('');
		} else {
			return this.novel.posts.map(p => p.tokens.map(this.renderToken.bind(this)).join(''));
		}
	}

	/**
	 * トークンレンダラー振り分け
	 * @param token トークン
	 * @return HTML
	 */
	private renderToken(token: Token): string {
		switch (token.type) {
			case 'text': return this.renderText(token);
			case 'anchor': return this.renderAnchor(<IAnchorToken>token);
			case 'character-name': return this.renderChar(<INamePartToken>token);
			default: throw `Unknown token "${token.type}"`;
		}
	}
}

export class SimpleRenderer extends Renderer {
	renderText = token => escape(token.text).replace(/\n/g, '<br>');
	renderAnchor = token => `<span class=anchor data-target="${token.target}">${escape(token.text)}</span>`;
	renderChar = token => `<b style="color:${token.character.color}">${escape(token.text)}</b>`;
}

export class ExtractedStyleRenderer extends Renderer {
	renderText = token => escape(token.text).replace(/\n/g, '<br>');
	renderAnchor = token => `<span class=anchor data-target="${token.target}">${escape(token.text)}</span>`;
	renderChar = token => {
		const klass = this.style.findById(token.character.id).class;
		return `<b class=${klass}>${escape(token.text)}</b>`;
	};

	/**
	 * レンダリングに使用されるキャラクタースタイル
	 */
	public style: CharsStyleMap;

	constructor(novel: Novel | Thread) {
		super(novel);

		this.style = new CharsStyleMap(novel.characters);
	}

	public renderCss(prefix?: string) {
		return this.style.toCSS(this.novel, prefix);
	}
}
