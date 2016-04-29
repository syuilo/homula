'use strict';

const should = require('should');

const homula = require('../built/main');

describe('basic', () => {
	let novel;

	it('analyze', () => {
		novel = new homula.Novel({
			title: '櫻子「ナデナデシテー」',
			text: '＜向日葵の家＞\n\n櫻子「向日葵～……」\n\n向日葵「何ですの？」\n\n...',
			characters: [{
				name: ['向日葵', 'ひま'],
				color: '#416798'
			}, {
				name: ['櫻子', 'さく'],
				color: '#e2b03a'
			}]
		});
	});

	it('compile to HTML', () => {
		const html = novel.toHtml();

		should.equal(html, '＜向日葵の家＞<br><br><b class=b>櫻子</b>「向日葵～……」<br><br><b class=a>向日葵</b>「何ですの？」<br><br>...');
	});

	it('get style', () => {
		const css = novel.getCSS();

		should.equal(css, '.a{color:#416798}.b{color:#e2b03a}');
	});
});
