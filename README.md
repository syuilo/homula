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
``` js
import * as homula from '../main';

// Init a novel instance
const novel = new homula.Novel();

// Analyze the novel
const ctx = novel.analyze();

/*
 * Now, we can access to utility methods of the analyzed novel instance
 */

// e.g. Generate HTML
const html = ctx.toHtml();
```

## License
[MIT](LICENSE)

[travis-link]: https://travis-ci.org/syuilo/homula
[travis-badge]: http://img.shields.io/travis/syuilo/homula.svg?style=flat-square
[david-runtime-link]: https://david-dm.org/syuilo/homula#info=dependencies&view=table
[david-runtime-badge]: https://img.shields.io/david/syuilo/homula.svg?style=flat-square
[david-dev-link]: https://david-dm.org/syuilo/homula#info=devDependencies&view=table
[david-dev-badge]: https://img.shields.io/david/dev/syuilo/homula.svg?style=flat-square
