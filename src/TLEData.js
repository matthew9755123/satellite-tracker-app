//API DOCUMENTATION: https://celestrak.org/NORAD/documentation/gp-data-formats.php

export const fetchBulkTLEData = async () => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const tleData = {};
    const groups = [
        'last 30 days launches',
        'space stations',
        'active satellites',
        'oldest / docked',
        'analyst satellites',
        'russian ASAT test debris (COSMOS 1408)',
        'chinese ASAT test debris (FENGYUN 1C)',
        'iridium 33 debris',
        'cosmos 2251 debris',
        'weather',
        'earth resources',
        'search & rescue (SARSAT)',
        'disaster monitoring',
        'tracking and data relay satellite system (TDRSS)',
        'ARGOS data collection system',
        'planet',
        'spire',
        'active geosynchronous',
        'movers',
        'GEO protected zone',
        'GEO protected zone plus',
        'intelsat',
        'SES',
        'eutelsat',
        'iridium',
        'starlink',
        'oneweb',
        'orbcomm',
        'globalstar',
        'swarm',
        'amateur radio',
        'experimental comm',
        'other comm',
        'gorizont',
        'raduga',
        'molniya',
        'GNSS',
        'GPS operational',
        'GLONASS operational',
        'galileo',
        'beidou',
        'satellite-based augmentation system (WAAS/EGNOS/MSAS)',
        'navy navigation satellite system (NNSS)',
        'russian LEO navigation',
        'space & earth science',
        'geodetic',
        'engineering',
        'education',
        'miscellaneous military',
        'radar calibration',
        'cubesats',
        'other satellites'
    ];    

    console.log("FETCHING TLE DATA...");
    try {
        for (const group of groups) {
            const response = await fetch(`https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=TLE`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for group: ${group}`);
            }

            let groupCount = 0
            const data = await response.text();
            const lines = data.split('\n').filter(line => line.trim() !== '');
            console.log(`DATA FETCHED FOR GROUP: ${group}`);

            for (let i = 0; i < lines.length; i += 3) {
                if (lines[i] && lines[i + 1] && lines[i + 2]) {
                    const satelliteName = lines[i].trim();
                    const line1 = lines[i + 1].trim();
                    const line2 = lines[i + 2].trim();

                    if (line1 && line2) {
                        const satelliteId = line1.split(' ')[1];
                        tleData[satelliteId] = {
                            name: satelliteName,
                            tle: [line1, line2],
                        };
                        groupCount += 1;
                    } else {
                        console.warn(`Skipping malformed TLE entry at line ${i} in group: ${group}`);
                    }
                }
            }
            console.log(`Fetched ${groupCount} satellites from ${group} group.`);
        }
        
        console.log("TOTAL SATELLITES FETCHED:", Object.keys(tleData).length);
    } catch (error) {
        console.error("From 'TLEData.js': ERROR FETCHING BULK TLE DATA... Error:", error);
    }
    return tleData;
};