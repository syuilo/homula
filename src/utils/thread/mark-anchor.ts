const assign = require('assign-deep');

import { ISS, IPost } from './interfaces';
import Token from '../tokenizer/token';
import { IAnchorToken } from '../tokenizer/rules/anchor';
import extractAnchors from './extract-anchors';

/**
 * 投稿の被安価投稿をマークします
 * @param ss スレッド
 * @param posts スレッドの投稿
 * @return マーク情報が付加された投稿の配列
 */
export default
	<T extends IPost & {
		isMaster: boolean;
		tokens: Token[]
	}>
	(ss: ISS, posts: T[]):
	(T & {
		isAnchor: boolean
	})[] => {

	// 本文内の安価リスト
	const anchors: string[] = [];

	// 本文だけ
	posts.filter(p => p.isMaster).forEach(p => {
		// 名前が安価している場合もある
		const nameMatch = extractAnchors(p.user.name);
		if (nameMatch !== null) {
			nameMatch.forEach(a => anchors.push(a.substr(2)));
		}

		// 本文中の安価
		p.tokens.filter(t => t.type === 'anchor').forEach((a: IAnchorToken) => {
			anchors.push(a.target);
		});
	});

	// SSのタイトル自体が安価している場合もある
	const titileMatch = extractAnchors(ss.title);
	if (titileMatch !== null) {
		titileMatch.forEach(a => anchors.push(a.substr(2)));
	}

	const anchorTargets: number[] = [];

	anchors.forEach(anchor => {
		const targets = parseAnchor(anchor);
		if (targets !== null) {
			targets.forEach(target => {
				anchorTargets.push(target);
			});
		}
	});

	const marked = <(T & {
		isAnchor: boolean;
	})[]>posts.map(post => {
		let isAnchor = false;

		// 本文から安価されている投稿
		if (anchorTargets.indexOf(post.number) !== -1) {
			isAnchor = true;
		}

		return assign(post, {
			isAnchor: isAnchor
		});
	});

	marked.filter(p => p.isAnchor).forEach(post => {
		const text = post.text;

		if (text === '') {
			return;
		}

		if ( // 安価上
			text[0] === '上' ||
			text[0] === '↑' ||
			/安価(.*?)[上↑]/.test(text)
		) {
			const _target = marked
				.filter(x => x.number === post.number - 1);
			if (_target.length !== 0) {
				const target = _target[0];
				target.isAnchor = true;
			}
		} else if ( // 安価下
			text[0] === '下' ||
			text[0] === '↓' ||
			/安価(.*?)[下↓]/.test(text) ||
			text.indexOf('ksk') > -1 ||
			text.indexOf('支援') > -1 ||
			text.indexOf('sien') > -1 ||
			text.indexOf('紫煙') > -1 ||
			text.indexOf('しえ') > -1 ||
			text.indexOf('④') > -1 ||
			text.indexOf('シエンタ') > -1
		) {
			const _target = marked
				.filter(x => x.number === post.number + 1);
			if (_target.length !== 0) {
				const target = _target[0];
				target.isAnchor = true;
			}
		}

		// 安価先がさらに安価してる場合があるため
		const anchors = getAnchorTargets(text);

		if (anchors === null) {
			return;
		}

		anchors.forEach(anchor => {
			marked
			.filter(x => x.number === anchor)
			.forEach(x => {
				x.isAnchor = true;
			});
		});
	});

	return marked;
}

function getAnchorTargets(text: string): number[] {
	const anchors: string[] = [];

	const anchorsMatch = extractAnchors(text);
	if (anchorsMatch === null) {
		return null;
	}

	anchorsMatch.forEach(a => anchors.push(a.substr(2)));

	const anchorTargets: number[] = [];

	anchors.forEach(anchor => {
		const targets = parseAnchor(anchor);
		if (targets !== null) {
			targets.forEach(target => {
				anchorTargets.push(target);
			});
		}
	});

	return anchorTargets;
}

function parseAnchor(anchor: string): number[] {
	if (/^\d+$/.test(anchor)) {
		return [parseInt(anchor, 10)];
	} else {
		return null;
	}

	// TODO: >>10~20 や >>10,20 や >>+1 などに対応
/*
	function range(start: number, stop: number, step: number): number[] {
		if (arguments.length <= 1) {
			stop = start || 0;
			start = 0;
		}
		step = step || 1;

		const length = Math.max(Math.ceil((stop - start) / step), 0);
		const range = Array(length);

		for (let idx = 0; idx < length; idx++, start += step) {
			range[idx] = start;
		}

		return range;
	}*/
}
