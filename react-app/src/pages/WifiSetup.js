import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const WifiSetup = () => {
  const [wifi, setwifi] = useState([]);
  const [connectedNetworks, setConnectedNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState({});
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [next, setNext] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/networks')
      .then(res => res.json())
      .then(data => {
        setwifi(data.networks);
        setConnectedNetworks(data.connectedNetworks);
        console.log(data);
      });
  }, []);

  const signalIcon = (sig_percent) => {
    if (sig_percent > 75) return <img src="perfectSignal.svg" />;
    else if (sig_percent > 50) return <img src="goodSignal.svg" />;
    else if (sig_percent > 25) return <img src="lowSignal.svg" />;
    else return <img src="lowSignal.svg" />;
  };

  const handleConnect = async () => {
    setResponse("");
    if (!selectedNetwork.SSID) {
      setResponse("Please select a network.");
      return;
    }
  
    if (selectedNetwork.Security && !password) {
      setResponse("Password is required for this network.");
      return;
    }
  
    try {
      setResponse("Connecting...");
      const response = await fetch("http://localhost:5000/addNetwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedNetwork, password }),
      });
  
      const result = await response.json();
      console.log(result);
  
      if (response.ok && result.message.includes("Successfully connected")) {
        setResponse("Successfully Connected!");
        setNext(true);
      } else {
        setResponse("Failed to connect. Please try again.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setResponse("Failed to connect. Please try again.");
    }
  };
  

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="Card">
        <h2>Networks</h2>
        {connectedNetworks.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <h3>Connected Networks</h3>
            {connectedNetworks.map((net, index) => (
              <div key={index}>
                <p>{net.SSID} (Device: {net.Device})</p>
              </div>
            ))}
          </div>
        )}
        <h3>Available Networks</h3>
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
                <p>Loading Networks...</p>
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
        {response && (
          <div className={(response.includes("Success")) ? "SuccessMessage" : (response.includes("Connect")) ? "ConnectingMessage" : "ErrorMessage"}>
            <p>{response}</p>
          </div>
        )}
        <div className="Button">
          {next ? (
            <button onClick={() => navigate("/")}>Next</button>
          ) : (
            <button onClick={handleConnect}>Connect</button>
          )}
        </div>
      </div>
    </div >
  );
};

export default WifiSetup;
