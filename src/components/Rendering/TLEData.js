import { getGroup } from "./config.js";
import { setGroupCount } from "./config.js";

function scaleValue(x, min1, max1, min2, max2) {
  return ((x - min1) / (max1 - min1)) * (max2 - min2) + min2;
}

export const fetchBulkTLEData = async () => {
  const group = getGroup();
  const now = new Date();
  const tleData = {};

  console.log(`FETCHING TLE DATA... ${group}`);

  try {
    const response = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=TLE`
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} for group: ${group}`
      );
    }

    let groupCount = 0;
    const data = await response.text();
    const lines = data.split("\n").filter((line) => line.trim() !== "");

    for (let i = 0; i < lines.length; i += 3) {
      const satelliteName = lines[i].trim();
      const line1 = lines[i + 1].trim();
      const line2 = lines[i + 2].trim();

      if (line1 && line2) {
        const satelliteId = line1.split(" ")[1];

        const meanMotion = parseFloat(line2.slice(52, 63).trim());
        const eccentricity = parseFloat(`0.${line2.slice(26, 33).trim()}`);

        const GM = 398600.4418;
        const T = 86400 / meanMotion;
        const semiMajorAxis = Math.cbrt((T ** 2 * GM) / (4 * Math.PI ** 2));
        const height = semiMajorAxis;
        const scaledHeight = scaleValue(height, 6556, 239202, 1.01, 7.5);

        tleData[satelliteId] = {
          name: satelliteName,
          tle: [line1, line2],
          meanMotion: meanMotion,
          eccentricity: eccentricity,
          semiMajorAxis: semiMajorAxis,
          height: scaledHeight,
        };
        groupCount++;
      }
    }

    console.log(`Fetched ${groupCount} satellites from ${group} group.`);
    setGroupCount(groupCount);
  } catch (error) {
    console.error(
      "From 'TLEData.js': ERROR FETCHING BULK TLE DATA... Error:",
      error
    );
  }
  return tleData;
};
