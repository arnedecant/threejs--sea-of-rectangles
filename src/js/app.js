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
		let rows = 20
		let cols = 20

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
				ENGINE.scene.add(mesh)

				row.push({
					mesh: mesh,
					row: i,
					col: j,
					delta: 0.01 * (Math.abs(i * j / 100) + 1)
				})

			}

			this.matrix.push(row)

		}

		ENGINE.scene.updateMatrixWorld(true)

	}

	render() {

        // render ENGINE

        ENGINE.render()

		// update

		this.matrix.forEach((row) => {

			row.forEach((rect) => {

				if (rect.mesh.scale.y > 3 || rect.mesh.scale.y < 1) rect.delta = 0 - rect.delta
				rect.mesh.scale.y += rect.delta

			})

		})

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
