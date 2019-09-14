'use strict'

export function normalize(v, vmin, vmax, tmin, tmax) {

	let nv = Math.max(Math.min(v, vmax), vmin)
	let dv = vmax - vmin
	let pc = (nv - vmin) / dv
	let dt = tmax - tmin
	let tv = tmin + (pc * dt)

	return tv;

}

export function random(min, max) {

	return Math.random() * (max - min) + min

}
