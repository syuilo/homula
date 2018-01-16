'use strict';

const fs = require('fs');

require.extensions['.html'] = (module, filename) => {
	module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.css'] = (module, filename) => {
	module.exports = fs.readFileSync(filename, 'utf8');
};

const should = require('should');

const homula = require('../');

const allorigin = require('./examples/origins.json');
const allchars = require('./examples/characters.json');
const world = new homula.Utility.World(allorigin, allchars);

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

		should.equal(html,
			'＜向日葵の家＞<br><br><b class=b>櫻子</b>「向日葵～……」<br><br><b class=a>向日葵</b>「何ですの？」<br><br>...');
	});

	it('get style', () => {
		const css = novel.getCSS();

		should.equal(css,
			'.a{color:#416798}.b{color:#e2b03a}');
	});

	it('get characters statistics', () => {
		const statistics = novel.getCharactersStatistics();

		should.equal(statistics[0].onStageRatio,
			0.6666666666666666);
	});
});

describe('advance', () => {
	const testText = require('./examples/ss/test.json').text;
	const builthtml = require('./examples/ss/test.built.html');
	const builtcss = require('./examples/ss/test.built.css');

	let novel;
	let origin;

	it('detect', () => {
		origin = homula.Utility.detectOrigin(world, null, testText);

		should.equal(origin[0].id, 'a');
	});

	it('analyze', () => {
		novel = new homula.Novel({
			text: testText,
			characters: world.getAllOriginCharacters(origin)
		});
	});

	it('compile to HTML', () => {
		const html = novel.toHtml();

		should.equal(html, builthtml);
	});

	it('get style', () => {
		const css = novel.getCSS();

		should.equal(css, builtcss);
	});
});
