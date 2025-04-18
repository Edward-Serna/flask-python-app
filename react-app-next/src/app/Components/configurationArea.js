"use client";

import { useEffect, useState } from "react";
import '../styles/home.css';
import '../styles/Settings.css';

const ConfigurationArea = ({ route }) => {
  const [username, setUsername] = useState("");
  const [machineName, setMachineName] = useState("");
  const [sshKey, setSshKey] = useState("");

  useEffect(() => {
    fetch("http://192.168.1.107:5000/getUsers")
      .then(response => response.json())
      .then(data => {
        if (data[0]) {
          setUsername(data[0].username)
          setMachineName(data[0].machineName)
          setSshKey(data[0].sshKey)
        }
      })
      .catch(error => console.log("Error fetching users:", error));
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sshKey) {
      try {
        const response = await fetch("http://192.168.1.107:5000/addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, machineName, sshKey }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          if (route) {
            route()
          }

        } else {
          console.log("Failed to add user");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  return (
    <>
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
            value={sshKey}
            className="TextArea"
            onChange={(event) => setSshKey(event.target.value)}
            placeholder="Begins with ‘ssh-rsa’, ‘ecdsa-sha2-nistp256’, etc."
            required
          />
        </div>
        <div className="Button">
          <button className="Button1" type="submit">Save</button>
        </div>
      </form>
    </>
  );
};

export default ConfigurationArea;
