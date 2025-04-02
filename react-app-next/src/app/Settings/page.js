"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import '../styles/home.css';
import '../styles/Settings.css';

const SettingsPage = () => {

  return (
    <div className="Page">
      <div  className="Container">
        <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
        <div className="SettingsCard">
          <div className="header">
            <h2>Settings</h2>
          </div>
          <div className="Control-Area">
            <div className="sidebar">
            <h4>Config</h4>
            </div>
            <div className="body">
            <h4>body</h4>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default SettingsPage;
