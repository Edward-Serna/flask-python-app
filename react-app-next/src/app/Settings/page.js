"use client";

import { useState } from "react";
import Image from "next/image";
import ConfigurationArea from "../Components/configurationArea";
import WifiArea from "../Components/wifiArea";
import DownloadArea from "../Components/downloadArea";

const SettingsPage = () => {
  const [active, setActive] = useState("Config")

  const renderBody = () => {
    switch (active) {
      case "Config": {
        useEffect(() => {
          fetch("http://10.42.0.1:5000/getUsers")
            .then(response => response.json())
            .then(data => {
              setUsers(data || {});
              console.log(data)
            })
            .catch(error => console.error("Error fetching users:", error));
        }, []);
        return (
          <>
            <h4>Configuration</h4>
            <ConfigurationArea />
          </>
        )
      }
      case "System":
        return (
          <WifiArea />
        )
      case "Download":
        return (
          <>
            <h4>Modifly Platform</h4>
            <DownloadArea />
          </>
        )
      default:
        return (
          <>
            <h4>Configuration</h4>
            <ConfigurationArea />
          </>
        );
    }
  };

  return (
    <div className="Page">
      <div className="Container">
        <Image priority className="img" src="MF_Logo.svg" width={300} height={100} alt="Logo" />
        <div className="SettingsCard">
          <div className="header">
            <div className="title1">
              <h3>Settings</h3>
            </div>
            <div className="title2">
              <h3>System v1.0</h3>
            </div>
          </div>
          <div className="Control-Area">
            <div className="sidebar">
              <div className={("Config" === active) ? "itemActive" : "item"} onClick={() => setActive("Config")}>
                <h5>Configuration</h5>
              </div>
              <div className={("System" === active) ? "itemActive" : "item"} onClick={() => setActive("System")}>
                <h5>System</h5>
              </div>
              <div className={("Download" === active) ? "itemActive" : "item"} onClick={() => setActive("Download")}>
                <h5>Download</h5>
              </div>
            </div>
            <div className="body">
              {renderBody()}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default SettingsPage;
