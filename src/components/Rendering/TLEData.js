//API DOCUMENTATION: https://celestrak.org/NORAD/documentation/gp-data-formats.php

export const fetchBulkTLEData = async (group) => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const tleData = {};


    console.log(`FETCHING TLE DATA... ${group}`);
    try {
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
                        console.warn(`Skipping malformed TLE entry at line in group: ${group}`);
                    }
                }
            }
            if (groupCount == 0){
                console.log("ALERT");
            }
            console.log(`Fetched ${groupCount} satellites from ${group} group.`);
        
        console.log("TOTAL SATELLITES FETCHED:", Object.keys(tleData).length);
    } catch (error) {
        console.error("From 'TLEData.js': ERROR FETCHING BULK TLE DATA... Error:", error);
    }
    return tleData;
};