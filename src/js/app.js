// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import Engine from './Engine.js';

class App {

	constructor() {

		window.COLORS = {
			white: 0xffffff,
			beige: 0xf6d7b0,
			cyan: 0x248079,
			brown: 0xA98F78,
			brownDark: 0x9A6169,
			green: 0x65BB61,
			greenLight: 0xABD66A,
			blue: 0x6BC6FF,
			yellow: 0xfedd52
		}

		window.ENGINE = new Engine()

		this.size = 2
		this.rows = 40
		this.cols = 40

		this.toRipple = new Set([])

		// init

		this.init()

	}

	init() {

		// add objects

		this.generate()

		// render

		this.render()

		setTimeout((e) => this.ripple(), 5000)

	}

	generate() {

		// generate matrix for rectangles

		this.matrix = []

		let colors = [0xffffff, 0xf6d7b0, 0x248079, 0xA98F78, 0x9A6169, 0x65BB61, 0xABD66A, 0x6BC6FF, 0xfedd52]
		let rows = this.rows / 2
		let cols = this.cols / 2

		// rows

		for (let i = -rows; i < rows; i++) {

			let row = []

			// columns

			for (let j = -cols; j < cols; j++) {

				let color = colors[Math.abs(i * j) % colors.length]

				let geometry = new THREE.BoxGeometry(this.size, this.size * 3, this.size)
				let material = new THREE.MeshBasicMaterial({color: color})

				// set anchor at bottom

				geometry.translate(0, this.size / 2, 0)

				let mesh = new THREE.Mesh(geometry, material)
				mesh.position.set(j * this.size, 0, i * this.size)

				mesh.scale.y = 2

				mesh.data = {
					row: i + this.rows / 2,
					col: j + this.cols / 2,
					// delta: 0.01 * (Math.abs(i * j / 100) + 1),
					delta: -0.01,
					count: 0
				}

				ENGINE.scene.add(mesh)

				row.push(mesh)

			}

			this.matrix.push(row)

		}

		ENGINE.scene.updateMatrixWorld(true)

		this.toRipple.add(this.matrix[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)])

	}

	ripple(mesh, index) {

		if (!mesh) return

		// Animate given mesh

		mesh.scale.y += mesh.data.delta

		if (mesh.scale.y > 3 || mesh.scale.y < 1) {
			mesh.data.delta = 0 - mesh.data.delta
			mesh.data.count++
		}

		let l = (mesh.scale.y / 3 * 80) / 100
		mesh.material.color.setHSL(220 / 360, 80 / 100, l)
		
		if (mesh.data.count >= 10 && mesh.scale.y == 2) this.toRipple.delete(mesh)

		// We only chain the given mesh to it's bounding meshes one single time

		if (mesh.data.hasChained) return

		// Get bounding meshes and ripple them as well
		// This will (try to) add a lot of meshes that are already rippling,
		// but because this.toRipple is a set, which is unable to hold
		// duplicate items, this is no longer an issue

		let row = mesh.data.row
		let col = mesh.data.col

		setTimeout((e) => {

			if (this.matrix[row - 1]) this.toRipple.add(this.matrix[row - 1][col])
			if (this.matrix[row + 1]) this.toRipple.add(this.matrix[row + 1][col])

			this.toRipple.add(this.matrix[row][col - 1])
			this.toRipple.add(this.matrix[row][col + 1])

		}, 200)

		mesh.data.hasChained = true

	}

	render() {

        // render ENGINE

        ENGINE.render()

		// update

		// this.matrix.forEach((row) => {

		// 	row.forEach((mesh) => {

		// 		if (mesh.scale.y > 3 || mesh.scale.y < 1) mesh.data.delta = 0 - mesh.data.delta
		// 		mesh.scale.y += mesh.data.delta

		// 	})

		// })

		this.toRipple.forEach((mesh, i) => this.ripple(mesh, i))

		/*
			□□□□□     □□■□□
			□□■□□ ==> □■□■□ ==> spread outward ...
			□□□□□     □□■□□
		*/

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
