/*!
 * Homula
 * Copyright(c) 2016-2018 syuilo
 * MIT Licensed
 */

import { Novel, Thread } from './novel';
import Renderer, { SimpleRenderer, ExtractedStyleRenderer } from './renderer';

import World from './utility/world';
import Origin from './utility/origin';
import detectOrigin from './utility/detect-origin';

import modifyTrip from './utility/thread/modify-trip';
import weakMarkMaster from './utility/thread/weak-mark-master';
import strongMarkMaster from './utility/thread/strong-mark-master';

export = {
	Novel,
	Thread,
	Renderer,
	renderers: {
		SimpleRenderer,
		ExtractedStyleRenderer
	},
	utility: {
		World,
		Origin,
		detectOrigin,
		modifyTrip,
		weakMarkMaster,
		strongMarkMaster
	}
};
