import * as THREE from 'three';

function Earth() {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: loader.load('src/assets/earthmap1k.jpg'),
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    return earthMesh;
}

export default Earth;