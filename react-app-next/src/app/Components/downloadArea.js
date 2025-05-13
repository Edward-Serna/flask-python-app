"use client";

import { useCallback } from "react";import '../styles/home.css';
import '../styles/Settings.css';
import "../styles/Download.css";

export default function downloadArea () {
  
  return (
    <>
      <div className="Body">
        <p>Create your own scripts, customize own visualizer, and manage your device from one place!</p>
        <div className="Buttons">
          <button className="DownloadButton">Download</button>
        </div>
      </div>
    </>
  );
};


