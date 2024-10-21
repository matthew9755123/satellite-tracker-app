import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Earth from './Earth';
import SatelliteRenderer from './Satellite_Renderer';

function Scene() {
  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 5;

    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthMesh = Earth();
    scene.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.09);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 0, 5);
    scene.add(sunLight);

    renderer.shadowMap.enabled = true;
    sunLight.castShadow = true;
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;

    SatelliteRenderer(earthGroup);

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
    window.addEventListener('resize', onWindowResize, false);

    const animate = () => {
      earthGroup.rotation.y += 0;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return <canvas id="myThreeJsCanvas" style={{ width: '100%', height: '100vh' }} />;
}

export default Scene;