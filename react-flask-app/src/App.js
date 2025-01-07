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
		<div className="App">
			<p>{currentDate}</p>
			<div className="Card">
				<div className="BodyLeft">
					<img src="./Modifly_Logo.svg" className="img"/>
				</div>
				<div className="BodyMain">
					<div className="inputBody">
						<p>Machine Name: </p>
						<p>Username: </p>
						<p>SSH Key: </p>
					</div>
					<button className="button">Next</button>
				</div>
			</div>
		</div>
	);
}

export default App;