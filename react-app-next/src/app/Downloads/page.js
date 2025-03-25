import React, { useEffect, useState } from "react";
import "../styles/Download.css";

const DownloadPage = () => {

  return (
    <div class="Page">
      <img class="img" alt="logo" src="MF_Logo.svg" />
      <div class="DownloadCard">
        <div class="Body">
        <h3>Download the Modifly Software today!</h3>
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
