"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Popup from 'reactjs-popup';
import Image from "next/image";
import 'reactjs-popup/dist/index.css';
import '../styles/home.css';

const WifiSetup = () => {
  const [wifi, setWifi] = useState([]);
  const [connectedNetworks, setConnectedNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [next, setNext] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const router = useRouter();
  const REQUIRED_NETWORK_COUNT = 1;

  useEffect(() => {
    setResponse("");
    setPassword("");
  }, [selectedNetwork]);

  useEffect(() => {
    fetch('http://192.168.1.107:5000/networks')
      .then(response => response.json())
      .then(data => {
        setWifi(data.networks || []);
        setConnectedNetworks(data.connectedNetworks || []);
      })
      .catch(error => console.error("Error fetching networks:", error));
  }, [next]);

  const signalIcon = (sigPercent) => {
    if (sigPercent > 75) return <img src="perfectSignal.svg" alt="Strong Signal" />;
    if (sigPercent > 50) return <img src="goodSignal.svg" alt="Good Signal" />;
    return <img src="lowSignal.svg" alt="Weak Signal" />;
  };

  const handleSelect = (network) => {
    setSelectedNetwork(network);
    if (network.Security) setPopupOpen(true);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setResponse("");

    if (!selectedNetwork?.SSID) {
      setResponse("Please select a network.");
      return;
    }

    if (selectedNetwork.Security && !password) {
      setResponse("Password is required.");
      return;
    }

    try {
      setResponse("Connecting...");
      const response = await fetch("http://192.168.1.107:5000/addNetwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedNetwork, password }),
      });

      const result = await response.json();
      if (response.ok && result.message.includes("Successfully connected")) {
        setResponse("Successfully Connected!");
        setNext(true);
        setPopupOpen(false);
      } else {
        setResponse(result.message);
      }
    } catch (error) {
      setResponse(`Failed to connect. ${error}`);
    }
  };

  return (
    <div className="Page">
      <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
      <div className="Card">
        <h2>Wireless Networks</h2>
        
        {connectedNetworks.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <h3>Connected Networks</h3>
            {connectedNetworks.map((net, index) => (
              <div key={index}>
                <p>{net.SSID} : {net.Device}</p>
              </div>
            ))}
          </div>
        )}

        {(!next && connectedNetworks.length <= REQUIRED_NETWORK_COUNT) && (
          <>
            <h3>Available Networks</h3>
            <div className="CardItem">
              <div className="Card2">
                {wifi.length > 0 ? (
                  wifi.map((obj, index) => (
                    <div 
                      key={index}
                      className={`Card2Item ${selectedNetwork === obj ? 'selected' : ''}`}
                      onClick={() => handleSelect(obj)}
                    >
                      <div className="SSID">
                        <p>{obj.SSID}</p>
                        {obj.Security ? <img src="lock-closed.svg" alt="Secured" /> : null}
                      </div>
                      <p>{obj.Signal_Percent ? signalIcon(obj.Signal_Percent) : <img src="perfectSignal.svg" alt="Signal" />}</p>
                    </div>
                  ))
                ) : (
                  <div className="Card2Item">
                    <p>Loading Networks...</p>
                  </div>
                )}
              </div>
            </div>

            <Popup open={popupOpen} onClose={() => setPopupOpen(false)} modal nested>
              <div className="PasswordArea">
                <p>Password for {selectedNetwork?.SSID}:</p>
                <form onSubmit={handleConnect}>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="off"
                    required
                  />
                </form>
              </div>

              {response && (
                <div className={
                  response.includes("Success") ? "SuccessMessage" :
                  response.includes("Connect") ? "ConnectingMessage" :
                  "ErrorMessage"
                }>
                  <p style={{ margin: '0px', marginBottom: '10px' }}>{response}</p>
                </div>
              )}

              <div className="Button">
                <button onClick={handleConnect}>Connect</button>
                <button type="button" onClick={() => setPopupOpen(false)}>Cancel</button>
              </div>
            </Popup>

            {response && !selectedNetwork?.Security && (
              <div className={
                response.includes("Success") ? "SuccessMessage" :
                response.includes("Connect") ? "ConnectingMessage" :
                "ErrorMessage"
              }>
                <p>{response}</p>
              </div>
            )}
          </>
        )}

        {(next || connectedNetworks.length > REQUIRED_NETWORK_COUNT) && <p className="SuccessMessage">Successfully Connected</p>}
        <div className="Button">
          {(next || connectedNetworks.length > REQUIRED_NETWORK_COUNT) ? (
            <button onClick={() => router.push('/Download')}>Next</button>
          ) : (
            <button onClick={handleConnect}>Connect</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WifiSetup;
