import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Download.css";

const DownloadPage = () => {

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="DownloadCard">
        <h2>Next Steps</h2>
        <div class="Body">
        <p>Download Modifly today!</p>
        <div class="Buttons">
          <button class="DownloadButton" type="submit">Download</button>
          <button Class="SettingsButton" type="submit">Settings</button>
        </div>
        </div>
      </div>
    </div >
  );
};

export default DownloadPage;
