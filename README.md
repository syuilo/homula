![](./homula.png)
------------------------------------------------

[![][travis-badge]][travis-link]
[![][david-runtime-badge]][david-runtime-link]
[![][david-dev-badge]][david-dev-link]

Homula is an analyzer of Novel of Japanese.

## Features
* Series inference
* Characters statistics
* Compile to HTML

## Install
``` bash
npm install homula
```

## Usage

### Basic

``` js
import * as homula from '../main';

// Init a novel instance
const novel = new homula.Novel({
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

// Compile
const html = novel.toHtml();
```

### Detect series
Homula can detect a series(ゆるゆり, まどマギ, ごちうさ, etc etc...) of any contents.
To do the detect, you must have a database of all of the series.

``` js
// Init a novel instance that detect
const novel = new homula.Novel({
	title: '櫻子「ナデナデシテー」',
	text: '＜向日葵の家＞\n\n櫻子「向日葵～……」\n\n向日葵「何ですの？」\n\n...'
});

const allseries = [
	{
		id: 'a',
		title: '魔法少女まどか☆マギカ',
		aliases: ['まどか☆マギカ', 'まどマギ']
	}, {
		id: 'b',
		title: 'ゆるゆり',
		aliases: null
	},
	...
];

const allchars = [
	{
		id: 'a',
		series: ['a']
		name: '鹿目 まどか',
		aliases: ['まどか', 'まど'],
		color: '#f79286'
	}, {
		id: 'b',
		series: ['a']
		name: '暁美 ほむら',
		aliases: ['ほむら', 'ほむ', 'ほむほむ'],
		color: '#8f5ab5'
	}, {
		id: 'c',
		series: ['b']
		name: '赤座 あかり',
		aliases: ['あかり', 'あか'],
		color: '#ff2445'
	},
	...
];

const world = new homula.utils.World(allseries, allchars);

const series = homula.utils.detectSeries(novel, world);
```

## FAQ

### なぜシリーズクラスがキャラクター情報を持つような設計でないの？
ひとりのキャラクターが、複数の異なる作品に登場するケースがあるからです(多対多)。

## License
[MIT](LICENSE)

[travis-link]: https://travis-ci.org/syuilo/homula
[travis-badge]: http://img.shields.io/travis/syuilo/homula.svg?style=flat-square
[david-runtime-link]: https://david-dm.org/syuilo/homula#info=dependencies&view=table
[david-runtime-badge]: https://img.shields.io/david/syuilo/homula.svg?style=flat-square
[david-dev-link]: https://david-dm.org/syuilo/homula#info=devDependencies&view=table
[david-dev-badge]: https://img.shields.io/david/dev/syuilo/homula.svg?style=flat-square
