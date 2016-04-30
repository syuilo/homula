'use strict';

const fs = require('fs');

require.extensions['.html'] = (module, filename) => {
	module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.css'] = (module, filename) => {
	module.exports = fs.readFileSync(filename, 'utf8');
};

const should = require('should');

const homula = require('../built/main');

const allseries = require('./examples/series.json');
const allchars = require('./examples/characters.json');
const world = new homula.Utility.World(allseries, allchars);

describe('thread', () => {

	let novel = require('./examples/ss/runba.json');
	const builthtml = require('./examples/ss/runba.built.html');
	const builtcss = require('./examples/ss/runba.built.css');

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

		should.equal(html, builthtml);
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
