import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const WifiSetup = () => {
  const [wifi, setwifi] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("")
  useEffect(() => {
    fetch('/networks')
      .then(res => res.json())
      .then(data => {
        setwifi(data.networks);
        // console.log(data.networks)
      });
  }, []);

  const signalIcon = (sig_percent) => {
    if (sig_percent > 75) {return <img src="perfectSignal.svg"/>}
    else if (sig_percent > 50) { return  <img src="goodSignal.svg"/>}
    else if (sig_percent > 25) { return  <img src="lowSignal.svg"/>}
    else return  <img src="lowSignal.svg"/>
  }

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="Card">
        <h2>Visible Networks</h2>
        <div className="CardItem">
          <div className="Card2">
            {(wifi) ?
              wifi.map((obj, index) => (
                <div key={index}
                  className={`Card2Item ${selectedNetwork === obj.SSID ? 'selected' : ''}`}
                  onClick={() => setSelectedNetwork(obj.SSID)}>
                  <p>{obj.SSID}</p>
                  <p>{(obj.SSID && !obj.Signal_Percent) ?
                    (<img src="perfectSignal.svg"/>) :
                    (signalIcon(obj.Signal_Percent))
                  }</p>
                </div>
              )) :
              <div className="Card2Item">
                <p>NO WiFi, or needs location to be turned ON</p>
              </div>
            }
          </div>
        </div>
        <div className="Button">
          <button
            onClick={async () => {
              const response = await fetch('http://localhost:5000/addNetwork', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedNetwork }),
              });

              if (response.ok !== null) {
                const result = await response.json();
                console.log(result);
              } else {
                console.log("error");
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default WifiSetup;
