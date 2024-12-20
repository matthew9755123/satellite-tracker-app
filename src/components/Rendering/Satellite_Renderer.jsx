import * as THREE from "three";
import { getLatLngObj } from "tle.js";
import { fetchBulkTLEData } from "./TLEData";
import { setGroup } from "./config";
import { getZoom } from "./config.js";

const calcPosFromLatLonRad = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
};

let tleData = {};
let positions = new Float32Array(0);
let pointCount = 0;

const initializeData = () => {
  fetchBulkTLEData("").then((data) => {
    tleData = data;
    pointCount = Object.keys(tleData).length;
    positions = new Float32Array(pointCount * 3);
  });
};

initializeData();

export const updateGroup = async (newGroup) => {
  setGroup(newGroup);

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
    map: loader.load("assets/satellite-dot.png"),
    transparent: true,
    depthWrite: false,
    depthTest: true,
    size: 0.0275,
  });
  const pointCloud = new THREE.Points(geometry, material);
  //pointCloud.frustumCulled = false;
  geometry.computeBoundingSphere();
  geometry.boundingSphere.radius *= 0.3;

  earthGroup.add(pointCloud);

  setInterval(() => updateSatellitePositions(), 1000);
};

const updateSatellitePositions = async () => {
  await tleData;
  const now = Date.now();
  let i = 1;

  Object.keys(tleData).forEach((satelliteId) => {
    const latLonObj = getLatLngObj(tleData[satelliteId], now);
    if (latLonObj) {
      const { lat, lng } = latLonObj;
      const height = tleData[satelliteId].height ? parseFloat(tleData[satelliteId].height) : 0; // ternary operator, like an if else
      const newPosition = calcPosFromLatLonRad(lat, lng, height);

      positions[i * 3] = newPosition[0];
      positions[i * 3 + 1] = newPosition[1];
      positions[i * 3 + 2] = newPosition[2];
      i++;
    }
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.attributes.position.needsUpdate = true;


};

export default SatelliteRenderer;
