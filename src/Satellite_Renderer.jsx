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

    // Create buffer geometry for satellite positions
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3); // 3 components per point (x, y, z)

    const loader = new THREE.TextureLoader();
    // Create material for the point cloud
    const material = new THREE.PointsMaterial({
        map: loader.load('src/assets/satellite-dot.png'),
        transparent: true,
        size: 0.02,
        depthWrite: false,
    });

    // Create the points object and add it to the scene
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

                // Set the new positions in the buffer array
                positions[i * 3] = newPosition[0];
                positions[i * 3 + 1] = newPosition[1];
                positions[i * 3 + 2] = newPosition[2];
                i++;
            }
        });

        // Update the positions attribute of the geometry
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.attributes.position.needsUpdate = true; // Mark the attribute for update
    };

    updateSatellitePositions();
    
    setInterval(updateSatellitePositions, 100);
};

export default SatelliteRenderer;
