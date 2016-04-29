/*!
 * Homula
 * Copyright(c) 2016 syuilo
 * MIT Licensed
 */

import { Novel, Thread } from './novel';
import * as interfaces from './interfaces';
import World from './world';
import Series from './utility/series';
import detectSeries from './utility/detect-series';
import modifyTrip from './utility/thread/modify-trip';
import weakMarkMaster from './utility/thread/weak-mark-master';
import strongMarkMaster from './utility/thread/strong-mark-master';

export = {
	Novel: Novel,
	Thread: Thread,
	World: World,
	Series: Series,
	interfaces: interfaces,
	Utility: {
		detectSeries: detectSeries,
		modifyTrip: modifyTrip,
		weakMarkMaster: weakMarkMaster,
		strongMarkMaster: strongMarkMaster
	}
};
