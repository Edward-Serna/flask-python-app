"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import './styles/home.css';

import ConfigurationArea from "./Components/configurationArea";

const Home = () => {
  const [usersFile, setUsersFile] = useState(false);
  const router = useRouter();


  useEffect(() => {
    fetch("http://10.42.0.1:5000/getUsers")
      .then(response => response.json())
      .then(data => {
        if(data[0]){
          setUsername(data[0].username)
          setMachineName(data[0].machineName)
          setSshKey(data[0].sshKey)
          setUsersFile(true)
        }
      })
      .catch(error => console.log("Error fetching users:", error));
  }, [])



  const handleRoute = () => {
    router.push('/WifiSetup')
  }

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
            <ConfigurationArea route={handleRoute} />
          </div>
        </>
        :
        <div className="Card">
          <h3>Your device is already Configured!</h3>
          <p>The username, machine name, and the public ssh key can be found in the settings page.</p>
          <div className="Button">
            <button className="Button2" onClick={() => router.push('/Settings')}>Setting</button>
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
