// import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import WifiSetup from "./pages/WifiSetup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path= "/WifiSetup" element={<WifiSetup />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
