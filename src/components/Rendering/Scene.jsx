import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Earth from "./Earth";
import { SatelliteRenderer } from "./Satellite_Renderer";

function Scene() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.z = 2;

    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 1.1;
    controls.maxDistance = 12.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.75;

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthMesh = Earth();
    earthGroup.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.7);
    sunLight.position.set(-25, 0, 6);
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
    window.addEventListener("resize", onWindowResize, false);

    let lastTime = 0;
    const animate = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      const fps = 1000 / deltaTime;
      setFps(fps);

      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return (
    <>
      <canvas id="myThreeJsCanvas" style={{ width: "100%", height: "100vh" }} />
      <div className="text-blue-400 uppercase italic font-mono font-extrabold text-2xl"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "white",
          fontSize: "20px",
          fontFamily: "Arial, sans-serif",
          zIndex: 100,
        }}
      >
        FPS: {fps.toFixed(2)}
      </div>
    </>
  );
}

export default Scene;
