'use strict'

export function shadow(opacity, target) {
  
	let materialShadow = new THREE.ShadowMaterial({opacity: opacity})
	let meshShadow = new THREE.Mesh(target.geometry, materialShadow)
	
	meshShadow.position.set(target.position.x, target.position.y, target.position.z)
	meshShadow.receiveShadow = true
	
	return meshShadow

}
