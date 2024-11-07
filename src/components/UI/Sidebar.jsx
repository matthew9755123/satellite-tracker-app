import React, { useState } from 'react';
import { updateGroup } from '../Rendering/Satellite_Renderer';
import { getGroup } from '../Rendering/config.js';

function Sidebar() {
    const navItems = [
        'last-30-days', 'stations', 'active', 'cosmos-1408-debris', 'fengyun-1c-debris', 'iridium-33-debris', 'cosmos-2251-debris', 'weather', 'resource',
        'sarsat', 'dmc', 'tdrss', 'argos', 'planet', 'spire', 'active', 'intelsat', 'SES', 'eutelsat', 'iridium', 'iridium-NEXT', 'starlink', 'oneweb', 
        'orbcomm', 'globalstar', 'swarm', 'amateur', 'x-comm', 'other-comm', 'gorizont', 'raduga', 'molniya', 'gnss', 'gps-ops', 'glo-ops', 'galileo', 'beidou',
        'sbas', 'nnss', 'musson', 'science', 'geodetic', 'engineering', 'education', 'military', 'radar', 'cubesat'
    ];

    const [group, setGroup] = useState('last-30-days');

    const handleClick = (newGroup) => {
        console.log('Group:', newGroup, "selected.");
        setGroup(newGroup);
        updateGroup(newGroup); 
    }

    return (
        <div>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-center text-white bg-gray-900 bg-opacity-80 px-5 py-2 rounded-lg shadow-lg text-4xl">
                Satellite Tracker
            </div>
            <div className="sidebar h-screen w-[250px] fixed top-0 left-0 bg-gray-800 text-white overflow-y-auto py-5">
       
                <div className="sidebar no-scrollbar h-screen w-[250px] fixed top-0 left-0 bg-gray-800 text-white overflow-y-auto py-5">
                    <h2 className="text-center mb-5 text-2xl">Satellite Groups</h2>
                    <ul className="space-y-2">
                        {navItems.map((group, index) => (
                            <li key={index} onClick={() => handleClick(group)} className="bg-blue-900 text-center py-2 hover:bg-gray-600 cursor-pointer">
                                <a className="block text-white">{group}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center text-white text-sm bg-gray-900 bg-opacity-80 px-5 py-2 rounded-lg shadow-lg text-xl">
                Currently Displaying: <span className="text-blue-400 uppercase italic font-mono font-extrabold text-2xl ">{getGroup()}</span>.
            </div>
        </div>
    );
}

export default Sidebar;