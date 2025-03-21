"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/home.css';

const WifiSetup = () => {
  const [wifi, setwifi] = useState([]);
  const [connectedNetworks, setConnectedNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState({});
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [next, setNext] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const router = useRouter();

  // const navigate = useNavigate();
  const prevUUID = useLocation().state
  const REQUIRED_NETWORK_COUNT = 1 // Starting val 0

  useEffect(() => {
    setResponse("")
    setPassword("")
  }, [selectedNetwork]);

  useEffect(() => {
    fetch('http://localhost:5000/networks')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
      })
      .then(data => { 
        setwifi(data.networks);
        setConnectedNetworks(data.connectedNetworks);
        console.log(data.connectedNetworks);
      })
      .catch(error => {
        console.error("Error fetching networks:", error);
      });
  }, [next]);
  

  const signalIcon = (sig_percent) => {
    if (sig_percent > 75) return <img src="perfectSignal.svg" />;
    else if (sig_percent > 50) return <img src="goodSignal.svg" />;
    else if (sig_percent > 25) return <img src="lowSignal.svg" />;
    else return <img src="lowSignal.svg" />;
  };

  const handleSelect = (network) => {
    setSelectedNetwork(network);
    if (network.Security) {
      setPopupOpen(true);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault()
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
        body: JSON.stringify({ prevUUID, selectedNetwork, password }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok && result.message.includes("Successfully connected")) {
        setResponse("Successfully Connected!");
        setNext(true);
        setPopupOpen(false);
      } else {
        setResponse(result.message);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setResponse(`Failed to connect. Please try again! ${error}`);
    }
  };

  return (
    <div class="Page">
      <Image src="/logo.svg" width={100} height={100} alt="Logo" />
      <div class="Card">
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
        {(!next && connectedNetworks.length <= REQUIRED_NETWORK_COUNT) &&
          <>
            <h3>Available Networks</h3>
            <div class="CardItem">
              <div class="Card2">
                {wifi.length > 0 ? (
                  wifi.map((obj, index) => (
                    <div key={index}
                      class={`Card2Item ${selectedNetwork == obj ? 'selected' : null}`}
                      onClick={() => handleSelect(obj)}
                    >
                      <div class="SSID">
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
                  <div class="Card2Item">
                    <p>Loading Networks...</p>
                  </div>
                )}
              </div>
            </div>
            <Popup open={popupOpen} onClose={() => setPopupOpen(false)} modal nested>
              <div class="PasswordArea">
                <p>Password for {selectedNetwork.SSID}:</p>
                <form onSubmit={handleConnect}>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="WifiPassAuto"
                    required
                  />
                </form>
              </div>
              {response && (
                <div class={
                  (response.includes("Success"))
                    ? "SuccessMessage"
                    : (response.includes("Connect"))
                      ? "ConnectingMessage"
                      : "ErrorMessage"}>
                  <p style={{margin: '0px', marginBottom: '10px'}}>{response}</p>
                </div>
              )}
              <div class="Button">
                <button onClick={handleConnect}>Connect</button>
                <button type="button" onClick={() => setPopupOpen(false)}>Cancel</button>
              </div>
            </Popup>

            {response && !selectedNetwork.Security && (
              <div class={
                (response.includes("Success"))
                  ? "SuccessMessage"
                  : (response.includes("Connect"))
                    ? "ConnectingMessage"
                    : "ErrorMessage"}>
                <p>{response}</p>
              </div>
            )}

          </>}
        {(next || connectedNetworks.length > REQUIRED_NETWORK_COUNT) && <p class="SuccessMessage">Successfully Connected</p>}
        <div class="Button">
          {(next || connectedNetworks.length > REQUIRED_NETWORK_COUNT) ? (
            <button onClick={() => navigate("/Download")}>Next</button>
          ) : (
            <button onClick={handleConnect}>Connect</button>
          )}
        </div>
      </div>
    </div >
  );
};

export default WifiSetup;
