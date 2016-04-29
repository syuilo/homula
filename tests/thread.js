'use strict';

const should = require('should');

const fs = require('fs');

require.extensions['.html'] = (module, filename) => {
	module.exports = fs.readFileSync(filename, 'utf8');
};

const homula = require('../built/main');

const allseries = require('./examples/series.json');
const allchars = require('./examples/characters.json');

let novel = require('./examples/ss/runba.json');
const built = require('./examples/ss/runba.built.html');

describe('thread', () => {

	const world = new homula.World(allseries, allchars);

	it('modify trips', () => {
		novel = homula.Utility.modifyTrip(novel);
	});

	it('mark master', () => {
		novel = homula.Utility.weakMarkMaster(novel);
	});

	let series;

	it('detect', () => {
		series = homula.Utility.detectSeries(world, novel);

		should.equal(series.id, 'a');
	});

	it('analyze', () => {
		novel = new homula.Thread({
			title: novel.title,
			posts: novel.posts,
			characters: world.getAllSeriesCharacters([series])
		});
	});

	it('compile to HTML', () => {
		const html = novel.toHtml().join('<hr>');

		should.equal(html, built);
	});

	it('get style', () => {
		const css = novel.getCSS();

		should.equal(css,
			'.a{color:#f79286}.b{color:#8f5ab5}.c{color:#929292}');
	});

	it('get characters statistics', () => {
		const statistics = novel.getCharactersStatistics();

		should.equal(statistics[0].onStageRatio,
			0.5085714285714286);
	});
});
