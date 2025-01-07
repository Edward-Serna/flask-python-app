import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [currentDate, setCurrentDate] = useState(0);
	const [machineName, setMachineName] = useState("");

	useEffect(() => {
		fetch('/date').then(res => res.json()).then(data => {
			setCurrentDate(data.date);
		});
	}, []);

	useEffect(() => {
		fetch('/time').then(res => res.json()).then(data => {
			setMachineName(data.time);
		});
	}, []);

	useEffect(() => {
		fetch('/time').then(res => res.json()).then(data => {
			setMachineName(data.time);
		});
	}, []);

	return (
		<div className="Page">
			<img className="img" src="MF_Logo.svg"/>
			<div className="Card">
				<h2>Welcome</h2>
				<p>Please complete these steps blah blah blah explanation about this current set of  fields that they need to fill out blah blah blah</p>
			</div>
      <div className="Card">
				<h2>First Time Setup</h2>
				<div className="CardItem">
          <p>Username: </p>
          <input type='text'/>
        </div>
        <div className="CardItem">
          <p>Machine Name: </p>
          <input type='text'/>
        </div >
        <div className="LargeInput">
          <p>SSH Key: </p>
          <textarea  type='text' placeholder="Begins with ‘ssh-rsa’, ‘ecdsa-sha2-nistp256’, ‘ecdsa-sha2-nistp384’, ‘ecdsa-sha2-nistp521’, ‘ssh-ed25519’, ‘sk-ecdsa-sha2-nistp256@openssh.com’, or ‘sk-ssh-ed25519@openssh.com’"/>
        </div>
      <div className="Button">
        <h2>Button</h2>
      </div>
			</div>
		</div>
	);
}

export default App;