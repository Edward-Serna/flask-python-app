import React, { useEffect, useState } from "react";
import "../App.css";

const WifiSetup = () => {
  const [wifi, setwifi] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState({});
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for storing error message

  useEffect(() => {
    fetch('/networks')
      .then(res => res.json())
      .then(data => {
        setwifi(data.networks);
        console.log(data);
      });
  }, []);

  const signalIcon = (sig_percent) => {
    if (sig_percent > 75) return <img src="perfectSignal.svg" />;
    else if (sig_percent > 50) return <img src="goodSignal.svg" />;
    else if (sig_percent > 25) return <img src="lowSignal.svg" />;
    else return <img src="lowSignal.svg" />;
  };

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="Card">
        <h2>Visible Networks</h2>
        <div className="CardItem">
          <div className="Card2">
            {wifi.length > 0 ? (
              wifi.map((obj, index) => (
                <div key={index}
                  className={`Card2Item ${selectedNetwork.SSID === obj.SSID ? 'selected' : ''}`}
                  onClick={() => setSelectedNetwork({ SSID: obj.SSID, Security: obj.Security })}>
                  <div className="SSID">
                    <p>{obj.SSID}</p>
                    {obj.SSID && obj.Security ? <img src="lock-closed.svg" /> : null}
                  </div>
                  <p>{obj.SSID && !obj.Signal_Percent ? (
                    <img src="perfectSignal.svg" />
                  ) : (
                    signalIcon(obj.Signal_Percent)
                  )}</p>
                </div>
              ))
            ) : (
              <div className="Card2Item">
                <p>NO WiFi, or needs location to be turned ON</p>
              </div>
            )}
          </div>
        </div>
        {selectedNetwork.Security && (
          <div className="Password">
            <p>Password:</p>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </div>
        )}
        {error && (
          <div className="ErrorMessage">
            <p>{error}</p>
          </div>
        )}
        <div className="Button">
          <button onClick={ async () => {
              setError(""); 
              if (!selectedNetwork.SSID) {
                setError("Please select a network.");
                return;
              }
          
              if (selectedNetwork.Security && !password) {
                setError("Password is required for this network.");
                return;
              }
          
              try {
                const response = await fetch('http://localhost:5000/addNetwork', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ selectedNetwork, password }),
                });
          
                const result = await response.json();
          
                if (!response.ok) {
                  setError("Failed to connect. Please try again.");
                } else {
                  console.log(result);
                  setError("" ); 
                }
              } catch (error) {
                console.error("Connection error:", error);
                setError("Failed to connect. Please try again.");
              }
            }
          }>Connect</button>
        </div>
      </div>
    </div>
  );
};

export default WifiSetup;
