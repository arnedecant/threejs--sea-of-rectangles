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

		// init

		this.init()

	}

	init() {

		// add objects

		this.generate()

		// render

		this.render()

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

				let geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
				let material = new THREE.MeshBasicMaterial({color: color})

				// set anchor at bottom

				geometry.translate(0, this.size / 2, 0)

				let mesh = new THREE.Mesh(geometry, material)
				mesh.position.set(j * this.size, 0, i * this.size)

				mesh.data = {
					row: i + this.rows / 2,
					col: j + this.cols / 2,
					delta: 0.01 * (Math.abs(i * j / 100) + 1)
				}

				ENGINE.scene.add(mesh)

				row.push(mesh)

			}

			this.matrix.push(row)

		}

		ENGINE.scene.updateMatrixWorld(true)

	}

	ripple(mesh) {

		// Get default mesh, if no mesh is given 

		if (!mesh) mesh = this.matrix[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)]

		console.log(this.matrix)
		
		// Skip code if the mesh has rippled already

		if (mesh.data.hasRippled) return
		mesh.data.hasRippled = true

		// Animate given mesh and set the hasRippled flag

		if (mesh.scale.y > 3 || mesh.scale.y < 1) mesh.data.delta = 0 - mesh.data.delta

		mesh.scale.y += mesh.data.delta
		mesh.data.hasRippled = true

		// Get bounding meshes and ripple them as well

		let row = mesh.data.row
		let col = mesh.data.col

		let toRipple = []

		if (this.matrix[row - 1]) toRipple.push(this.matrix[row - 1][col])
		if (this.matrix[row + 1]) toRipple.push(this.matrix[row + 1][col])

		toRipple.push(this.matrix[row][col - 1])
		toRipple.push(this.matrix[row][col + 1])

		toRipple.forEach((mesh) => this.ripple(mesh))

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

		setTimeout((e) => this.ripple(), 5000)

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
