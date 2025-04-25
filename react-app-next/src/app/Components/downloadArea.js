// "use client";

// import { useEffect, useState } from "react";
import '../styles/home.css';
import '../styles/Settings.css';
import "../styles/Download.css";

const downloadArea = () => {

  return (
    <>
      <div className="Body">
        <p>Create your own scripts, customize own visualizer, and manage your device from one place!</p>
        <div className="Buttons">
          <button className="DownloadButton" type="submit">Download</button>
        </div>
      </div>
    </>
  );
};

export default downloadArea;
