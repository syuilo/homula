import Character from './character';
import CharsStyleMap from './chars-style-map';

import Token from './compiler/token';
import tokenize from './compiler/tokenizer';
import render from './compiler/render';

import name from './compiler/rules/name-part-of-serif';

export interface Options {
	title: string;
	text: string;
	characters: {
		name: string[];
		color: string;
	}[];
}

/**
 * ノベルクラス
 * @class Novel
 */
export default class {
	id: string;
	title: string;
	text: string;
	tokens: Token[];
	characters: Character[];
	charactersStyle: CharsStyleMap;

	// type of myself
	type: 'novel';

	constructor(options: Options) {
		this.text = options.text;
		
		this.charactersStyle = new CharsStyleMap(this.characters);

		this.tokens = tokenize({
			id: this.id,
			characters: this.characters
		}, this.text, [name]);
	}

	/**
	 * このノベル本文のHTMLを生成します
	 * @method Novel#toHtml
	 */
	public toHtml(): string {
		return render(this.tokens, this.charactersStyle);
	}
	
	/**
	 * このノベル本文のCSSを取得します
	 * @method Novel#getCSS
	 */
	public getCSS(): string {
		return this.charactersStyle.toCSS(this);
	}
}
