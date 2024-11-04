import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom"
import Scene from './components/Rendering/Scene';
import Sidebar from "./components/UI/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Scene />
        <Sidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;
