import * as THREE from 'three';

function Earth() {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        map: loader.load('assets/2_no_clouds_16k.jpg'),
    });

    const earthMesh = new THREE.Mesh(geometry, material);

    const lightsMaterial = new THREE.MeshStandardMaterial({
        map: loader.load('assets/earthlights16k.jpg'),
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
   // earthMesh.add(lightsMesh);
    
    const cloudsMat = new THREE.MeshStandardMaterial({
        map: loader.load("assets/earthcloudmap16k.jpg"),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: loader.load('assets/earthcloudmaptrans1k.jpg'),
      });
      const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
      cloudsMesh.scale.setScalar(1.03);
      //earthMesh.add(cloudsMesh);
    
    return earthMesh;

}

export default Earth;