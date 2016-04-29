'use strict';

const should = require('should');

const homula = require('../built/main');

const allseries = require('./examples/series.json');
const allchars = require('./examples/characters.json');

let novel = require('./examples/ss/runba.json');

describe('thread', () => {

	const world = new homula.World(allseries, allchars);

	it('modify trips', () => {
		novel = homula.Utility.modifyTrip(novel);
	});

	it('mark master', () => {
		novel = homula.Utility.weakMarkMaster(novel);
	});

	it('detect', () => {
		const series = homula.Utility.detectSeries(world, novel);

		should.equal(series.id, 'a');
	});
});
