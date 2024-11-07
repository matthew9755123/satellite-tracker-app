import * as THREE from 'three';
import { getLatLngObj } from 'tle.js';
import { fetchBulkTLEData } from './TLEData';
import { setGroup } from './config';

const calcPosFromLatLonRad = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return [x, y, z];
};

let tleData = await fetchBulkTLEData('last-30-days');
let pointCount = Object.keys(tleData).length;
let positions = new Float32Array(pointCount * 3);

export const updateGroup = async (newGroup) => {
    setGroup(newGroup)

    console.log(`Loading:  ${newGroup}`);
    tleData = await fetchBulkTLEData();
    console.log(`${newGroup} loaded`);
    
    pointCount = Object.keys(tleData).length;
    positions = new Float32Array(pointCount * 3);
};

const geometry = new THREE.BufferGeometry();

export const SatelliteRenderer = (earthGroup) => {
    const loader = new THREE.TextureLoader();
    const material = new THREE.PointsMaterial({
        map: loader.load('assets/satellite-dot.png'),
        transparent: true,
        size: 0.02,
        depthWrite: false
    });
    const pointCloud = new THREE.Points(geometry, material);
    earthGroup.add(pointCloud);

    setInterval(() => updateSatellitePositions(), 500);
};

const updateSatellitePositions = async () => {
    await tleData;
    const now = Date.now();
    let i = 1;

    Object.keys(tleData).forEach(satelliteId => {
        const latLonObj = getLatLngObj(tleData[satelliteId], now);
        if (latLonObj) {
            const { lat, lng } = latLonObj;
            const newPosition = calcPosFromLatLonRad(lat, lng, 1.01);

            positions[i * 3] = newPosition[0];
            positions[i * 3 + 1] = newPosition[1];
            positions[i * 3 + 2] = newPosition[2];
            i++;
        }
    });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.attributes.position.needsUpdate = true; 
};

export default SatelliteRenderer;
