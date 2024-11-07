
# **🌌 Satellite Tracker**
A web-based satellite tracking tool using Three.js for 3D visualization and CelesTrak’s NORAD TLE data for accurate satellite positions. This project renders real-time satellite orbits and positions on a 3D globe, using point clouds to handle high-performance rendering even with multiple satellites.

## **✨ Features**
* **Real-Time Tracking:** Fetches up-to-date TLE (Two-Line Element) data from CelesTrak, provided by NORAD.
* **3D Globe Rendering:** Projects satellite positions onto a 3D Earth using Three.js.
* **Efficient Performance:** Leverages point clouds to ensure smooth rendering even when displaying large numbers of satellites.

## **🚀 Technologies**
* **Three.js** - for 3D rendering and visualization
* **CelesTrak NORAD TLE Data** - for precise satellite tracking data
* **React.js** - for simple web framework

## **📸 Screenshots**
![screenshot of current version](https://github.com/matthew9755123/satellite-tracker-app/blob/main/public/assets/readme.png)

## **📡 How It Works**
* **Fetch TLE Data:** The app retrieves up-to-date satellite TLE data from CelesTrak.
* **Data Conversion:** TLE data is converted into latitude and longitude coordinates.
* **3D Mapping:** The converted data points are projected onto a 3D globe in real time.
* **Efficient Rendering:** A point cloud is used to efficiently handle the rendering of numerous satellites simultaneously.

## **📅 Current Tasks**
### **Technical Improvements**
* **Backend Development:** Create a backend to cache and periodically update TLE data, reducing the frequency of API calls to CelesTrak (updated every 12 hours).
*Accurate Solar Positioning: Integrate accurate sun positioning based on the current time to ensure realistic shadow casting on Earth.
* **Loading Screen/Bar:** Add a loading screen while the earth, satellites and TLE data is all gathered and rendered. 
* **Interactive Satellite Information:** Enable satellite selection to display detailed information about each satellite.
* **Earth Spin and Sun Brightness Controls:** Add controls to adjust the Earth’s rotation speed and the brightness of the sun.
* **Orbital Heights:** Display satellites at varying altitudes according to their actual orbital heights instead of placing them all at the same level.
### **Aesthetic Enhancements**
* **Enhanced Earth Model:** Adjust the Earth’s visual design for a more appealing look.
* **UI Improvements:** Refine the interface to be more intuitive and visually attractive.
*Realistic Space Background: Add a starry, possibly celestially accurate, space background to improve the visual depth of the scene.

## **🤝 Contributing**
Contributions are welcome! Feel free to submit a pull request or open an issue.