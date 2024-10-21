export const fetchBulkTLEData = async () => {
    const tleData = {};

    try {
        const response = await fetch(
            'https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=TLE'
        );
        const data = await response.text();
        const lines = data.split('\n').filter(line => line.trim() !== '');

        for (let i = 0; i < lines.length; i +=3) {
            const satelliteId = lines[i].split(' ')[1];
            tleData[satelliteId] = [lines[i+1], lines[i+2]];
        }
    } catch (error) {
        console.error("From 'TLEData.js': ERROR FETCHING BULK TLE DATA... Error: ", error);
    }
    return tleData;
};