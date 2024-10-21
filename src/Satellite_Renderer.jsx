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
    const satelliteMeshes = {};
    const tleData = await fetchBulkTLEData();

    const updateSatellitePositions = () => {
        const now = Date.now();

        Object.keys(tleData).forEach(satelliteId => {
            const latLonObj = getLatLngObj(tleData[satelliteId], now);
            if (latLonObj) {
                const { lat, lng} = latLonObj;
                const newPosition = calcPosFromLatLonRad(lat, lng, 1.1);
                
                if (!satelliteMeshes[satelliteId]) {
                    const dotGeo = new THREE.SphereGeometry(0.005, 25, 25);
                    const dotMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff });
                    const dotMesh = new THREE.Mesh(dotGeo, dotMaterial);

                    satelliteMeshes[satelliteId] = dotMesh;
                    earthGroup.add(dotMesh);
                }

                satelliteMeshes[satelliteId].position.set(
                    newPosition[0], newPosition[1], newPosition[2]
                );
            }
        });
    };

    updateSatellitePositions();
    
    setInterval(updateSatellitePositions, 2000);
};

export default SatelliteRenderer;