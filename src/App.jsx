import './App.css';
import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getLatLngObj } from 'tle.js';
import { getGroundTracks } from 'tle.js';

function App() {
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

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: loader.load("src/assets/earthmap1k.jpg"),
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);
    scene.add(earthGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.09);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 0, 5);
    scene.add(sunLight);

    renderer.shadowMap.enabled = true;
    sunLight.castShadow = true;
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;

    const calcPosFromLatLonRad = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
    
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
    
      return [x, y, z];
    };
    
    const dotGeo = new THREE.SphereGeometry(0.006, 25, 25); 
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dotMesh = new THREE.Mesh(dotGeo, dotMaterial);

    const fetchTLEData = async (satelliteId) => {
      try {
        const response = await fetch(`https://celestrak.com/NORAD/elements/gp.php?CATNR=${satelliteId}&FORMAT=TLE`);
        const data = await response.text();
        console.log(data);
    
        const tleLines = data.split('\n').filter(line => line.trim() !== '');
        
        if (tleLines.length < 2) {
          throw new Error('Invalid TLE data');
        }
    
        const line1 = tleLines[1];
        const line2 = tleLines[2]; 
    
        const latLonObj = getLatLngObj([line1, line2]);
        console.log(latLonObj);
    
        return latLonObj;
    
      } catch (error) {
        console.error('Error fetching TLE data from Celestrak:', error);
      }
    };
    let lastFetchTime = 0; 
    const fetchAndUpdateDotPosition = () => {
      fetchTLEData(25544).then(latLonObj => {
        if (latLonObj) {
          const lat = latLonObj.lat; 
          const long = latLonObj.lng;

          const newPosition = calcPosFromLatLonRad(lat, long, 1.1); 
          dotMesh.position.set(newPosition[0], newPosition[1], newPosition[2]);

          if (!earthGroup.children.includes(dotMesh)) {
            earthGroup.add(dotMesh);
          }
        }
      });
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    const animate = (time) => {
      const timeElapsedSinceLastFetch = time - lastFetchTime;

      if (timeElapsedSinceLastFetch >= 1000) {
        fetchAndUpdateDotPosition();
        lastFetchTime = time;
      }

      earthGroup.rotation.y += 0.0009; 

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate(0); 

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div>
      <canvas id='myThreeJsCanvas' style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

export default App;
