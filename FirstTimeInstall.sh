#!/bin/bash

echo "Updating System..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt install python3-pip python3.12-venv -y

echo "Setting up the API..."
sudo pip3 install flask-restful 
cd flask-server
sudo python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate 
cd ..

echo "Install all dependencies for Next.js..."
cd react-app-next
npm install
cd ..

echo "Creating the Logs..."
mkdir .Logs && cd .Logs
touch flask.log
touch react.log
cd ..

echo "Sucessfully Installed Repo!!"