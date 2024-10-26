import * as THREE from 'three';
import { getLatLngObj } from 'tle.js';
import { fetchBulkTLEData } from './TLEData';

const calcPosFromLatLonRad = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return [x, y, z];
};

const SatelliteRenderer = async (earthGroup) => {
    const satellitePositions = [];
    const tleData = await fetchBulkTLEData();
    const pointCount = Object.keys(tleData).length;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);

    const loader = new THREE.TextureLoader();
    const material = new THREE.PointsMaterial({
        map: loader.load('src/assets/satellite-dot.png'),
        transparent: true,
        size: 0.01,
        depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    earthGroup.add(pointCloud);

    const updateSatellitePositions = () => {
        const now = Date.now();

        let i = 0;
        Object.keys(tleData).forEach(satelliteId => {
            const latLonObj = getLatLngObj(tleData[satelliteId], now);
            if (latLonObj) {
                const { lat, lng } = latLonObj;
                const newPosition = calcPosFromLatLonRad(lat, lng, 1.05);

                positions[i * 3] = newPosition[0];
                positions[i * 3 + 1] = newPosition[1];
                positions[i * 3 + 2] = newPosition[2];
                i++;
            }
        });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.attributes.position.needsUpdate = true;
    };

    updateSatellitePositions();
    
    setInterval(updateSatellitePositions, 500);
};

export default SatelliteRenderer;