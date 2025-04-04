"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import './styles/home.css';

const Home = () => {
  const [usersFile, setUsersFile] = useState(false);
  const [username, setUsername] = useState("");
  const [machineName, setMachineName] = useState("");
  const [sshKey, setSshKey] = useState("");
  const [copy, setCopy] = useState(false)
  const router = useRouter();

  fetch('http://192.168.1.107:5000/GetUsers')
    .then(response => response.json())
    .then(data => {
      setUsersFile(data.fileExists);  // Update the state based on file existence
      console.log(data)
    })

  const handleSSH = async () => {
    try {
      const response = await fetch("http://192.168.1.107:5000/newSSHKey", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setSshKey(data.sshKey);
      } else {
        console.log("Failed to generate SSH key.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCopy = () => {
    setCopy(true);
    navigator.clipboard.writeText(sshKey);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        router.push('/WifiSetup');
      } else {
        console.log("Failed to add user");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCopy(false)
    }, 500);
  }, [copy]);

  return (
    <div className="Page">
      <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
      {!usersFile ?
        <>
          <div className="Card">
            <h2>Welcome</h2>
            <p> Welcome to your new device! Please fill out the necessary information to get started.</p>
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
                <p>SSH Public Key: </p>
                {(!copy) ?
                  <textarea
                    value={sshKey}
                    className="TextArea"
                    onChange={(event) => setSshKey(event.target.value)}
                    onClick={!sshKey ? handleSSH : handleCopy}
                    placeholder="Click to Generate a SSH Key!"
                    readOnly
                  />
                  :
                  <div className="TextArea">
                    <p>Copied to clipboard</p>
                  </div>
                }

              </div>
              <div className="Button">
                <button type="submit">Next</button>
              </div>
            </form>
          </div>
        </>
        :
        <div className="Card">
          <h3>Your device is already Configured!</h3>
          <div className="Button">
            <button type="submit">Next</button>
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
