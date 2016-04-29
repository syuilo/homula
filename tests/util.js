'use strict';

const should = require('should');

const homula = require('../built/main');

describe('detect-series', () => {
	const novel = {
		title: '櫻子「ナデナデシテー」',
		text: '＜向日葵の家＞\n\n櫻子「向日葵～……」\n\n向日葵「何ですの？」\n\n...'
	};

	const allseries = [
		{
			id: 'a',
			title: ['魔法少女まどか☆マギカ', 'まどか☆マギカ', 'まどマギ']
		}, {
			id: 'b',
			title: ['ゆるゆり']
		}, {
			id: 'c',
			title: ['ご注文はうさぎですか？', 'ごちうさ']
		}
	];

	const allchars = [
		{
			series: 'a',
			name: ['まどか', 'まど'],
			color: '#f79286'
		}, {
			series: 'a',
			name: ['ほむら', 'ほむ', 'ほむほむ'],
			color: '#8f5ab5'
		}, {
			series: 'b',
			name: ['あかり', 'あか'],
			color: '#ff2445'
		}, {
			series: 'b',
			name: ['向日葵', 'ひま'],
			color: '#416798'
		}, {
			series: 'b',
			name: ['櫻子', 'さく'],
			color: '#e2b03a'
		}
	];

	const world = new homula.World(allseries, allchars);

	it('detect', () => {
		const series = homula.Utility.detectSeries(world, novel)[0];

		should.equal(series.id, 'b');
	});
});
