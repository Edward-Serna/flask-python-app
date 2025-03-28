"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/Download.css";
import '../styles/home.css';


const DownloadPage = () => {

  return (
    <div className="Page">
      <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
      <div className="DownloadCard">
        <div className="Body">
        <h3>Download the Modifly Platform today!</h3>
        <p>Create your own scripts, customize your own visualizer, and manage your device from one place!</p>
        <div className="Buttons">
          <button className="DownloadButton" type="submit">Download</button>
          <button className="SettingsButton" type="submit">Settings</button>
        </div>
        </div>
      </div>
    </div >
  );
};

export default DownloadPage;
