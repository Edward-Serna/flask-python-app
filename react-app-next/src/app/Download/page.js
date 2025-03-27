"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/Download.css";
import '../styles/home.css';


const DownloadPage = () => {

  return (
    <div class="Page">
      <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
      <div class="DownloadCard">
        <div class="Body">
        <h3>Download the Modifly Software today!</h3>
        <div class="Buttons">
          <button className="DownloadButton" type="submit">Download</button>
          <button Class="SettingsButton" type="submit">Settings</button>
        </div>
        </div>
      </div>
    </div >
  );
};

export default DownloadPage;
