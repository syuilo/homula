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

describe('thread', () => {

	const testNovel = require('./examples/ss/runba.json');
	const builthtml = require('./examples/ss/runba.built.html');
	const builtcss = require('./examples/ss/runba.built.css');

	let posts;
	let origin;

	it('detect origin', () => {
		posts = testNovel.posts;
		posts = posts.map(p => homula.Utility.modifyTrip(p));
		posts = homula.Utility.weakMarkMaster(posts);
		const text = posts.filter(p => p.isMaster).map(p => p.text).join('\n\n');
		origin = homula.Utility.detectOrigin(world, testNovel.title, text);

		should.equal(origin[0].id, 'a');
	});

	let novel;

	it('analyze', () => {
		novel = new homula.Thread({
			title: testNovel.title,
			posts: posts,
			characters: world.getAllOriginCharacters(origin)
		});
	});

	it('compile to HTML', () => {
		const html = novel.toHtml().join('<hr>');

		should.equal(html + '\r\n', builthtml);
	});

	it('get style', () => {
		const css = novel.getCSS();

		should.equal(css, builtcss);
	});

	it('get characters statistics', () => {
		const statistics = novel.getCharactersStatistics();

		should.equal(statistics[0].onStageRatio,
			0.46596858638743455);
	});
});
