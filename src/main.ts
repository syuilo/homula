/*!
 * Homula
 * Copyright(c) 2016 syuilo
 * MIT Licensed
 */

import { Novel, Thread } from './novel';
import * as interfaces from './interfaces';
import Renderer from './renderer';

	import World from './utility/world';
	import Origin from './utility/origin';
	import detectOrigin from './utility/detect-origin';

		import modifyTrip from './utility/thread/modify-trip';
		import weakMarkMaster from './utility/thread/weak-mark-master';
		import strongMarkMaster from './utility/thread/strong-mark-master';

export = {
	Novel: Novel,
	Thread: Thread,
	interfaces: interfaces,
	Renderer: Renderer,
	Utility: {
		World: World,
		Origin: Origin,
		detectOrigin: detectOrigin,
		modifyTrip: modifyTrip,
		weakMarkMaster: weakMarkMaster,
		strongMarkMaster: strongMarkMaster
	}
};
