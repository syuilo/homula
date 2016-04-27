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
		id: 'a',
		name: '古谷 向日葵',
		aliases: ['向日葵', 'ひま'],
		color: '#416798'
	}, {
		id: 'b',
		name: '大室 櫻子',
		aliases: ['櫻子', 'さく'],
		color: '#e2b03a'
	}]
});

// Analyze the novel
const ctx = novel.analyze();

/*
 * Now, we can access to utility methods of the analyzed novel instance
 */

// e.g. Generate HTML
const html = ctx.toHtml();
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
		aliases: ['まどか☆マギカ', 'まどマギ'],
		characters: ...
	}, {
		id: 'b',
		title: 'ゆるゆり',
		aliases: null,
		characters: ...
	},
	...
];

const series = homula.utils.detectSeries(novel, allseries);
```

## License
[MIT](LICENSE)

[travis-link]: https://travis-ci.org/syuilo/homula
[travis-badge]: http://img.shields.io/travis/syuilo/homula.svg?style=flat-square
[david-runtime-link]: https://david-dm.org/syuilo/homula#info=dependencies&view=table
[david-runtime-badge]: https://img.shields.io/david/syuilo/homula.svg?style=flat-square
[david-dev-link]: https://david-dm.org/syuilo/homula#info=devDependencies&view=table
[david-dev-badge]: https://img.shields.io/david/dev/syuilo/homula.svg?style=flat-square
