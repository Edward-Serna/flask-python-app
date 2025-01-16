import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const [machineName, setMachineName] = useState("");
  const [sshKey, setSshKey] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();

    try {
      const response = await fetch("/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, machineName, sshKey }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        navigate("/WifiSetup");
      } else {
        console.error("Failed to add user");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="Card">
        <h2>Welcome</h2>
        <p>
          Please complete these steps blah blah blah explanation about this
          current set of fields that they need to fill out blah blah blah
        </p>
      </div>

      <div className="Card">
        <h2>First Time Setup</h2>
        <form onSubmit={handleSubmit}>
          <div className="CardItem">
            <p>Username: </p>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              type="text"
              required
            />
          </div>
          <div className="CardItem">
            <p>Machine Name: </p>
            <input
              value={machineName}
              onChange={(event) => setMachineName(event.target.value)}
              type="text"
              required
            />
          </div>
          <div className="LargeInput">
            <p>SSH Key: </p>
            <textarea
              type="text"
              value={sshKey}
              onChange={(event) => setSshKey(event.target.value)}
              placeholder="Begins with ‘ssh-rsa’, ‘ecdsa-sha2-nistp256’, etc."
              required
            />
          </div>
        <div className="Button">
          <button type="submit">Next</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
