"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import './styles/home.css';

const Home = () => {
  const [username, setUsername] = useState("");
  const [machineName, setMachineName] = useState("");
  const [sshKey, setSshKey] = useState("");
  const router = useRouter();

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

  return (
    <div className="Page">
      <Image src="MF_Logo.svg" width={300} height={100} alt="Logo" />
      <div className="Card">
        <h2>Welcome</h2>
        <p>Please complete the setup.</p>
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
            <textarea
              value={sshKey}
              onChange={(event) => setSshKey(event.target.value)}
              placeholder="Begins with ‘ssh-rsa’.pub, ‘ecdsa-sha2-nistp256’.pub, etc."
              
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
