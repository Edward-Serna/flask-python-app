import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [machineName, setMachineName] = useState("");

  return (
    <div className="Page">
      <img className="img" alt="logo" src="MF_Logo.svg" />
      <div className="Card">
        <h2>Welcome</h2>
        <p>Please complete these steps blah blah blah explanation about this current set of fields that they need to fill out blah blah blah</p>
      </div>
      <div className="Card">
        <h2>First Time Setup</h2>
        <div className="CardItem">
          <p>Username: </p>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
        </div>
        <div className="CardItem">
          <p>Machine Name: </p>
          <input
           value={machineName}
           onChange={(event) => setMachineName(event.target.value)}
           type="text" 
           />
        </div>
        <div className="LargeInput">
          <p>SSH Key: </p>
          <textarea
            type="text"
            placeholder="Begins with ‘ssh-rsa’, ‘ecdsa-sha2-nistp256’, etc."
          />
        </div>
        <div className="Button">
          <button
            onClick={async () => {
              const response = await fetch('http://localhost:5000/addUser', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, machineName }),
              });

              if (response.ok) {
                const result = await response.json();
                console.log(result.message);
              } else {
                console.error("Failed to add user");
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

export default App;
