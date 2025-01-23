<img src="./react-app/public/Modifly_Logo.svg" height="45"><br>
# Getting Started Wizard
Start up page using React as frontend and Flask for backend.

## Prerequisites
### Linux
```bash
sudo apt update
```
```bash
sudo apt install nodejs npm
```
#### Verify: 
```bash
node -v
npm -v
```
### Windows
Install [Node.js](https://nodejs.org/en/) <br/>
The Node installation also installs NPM ([Node Page Manager](https://www.npmjs.com/))<br/>
#### Verify: 
```bash
node -v
npm -v
```
## Flask (API Server)
### Linux
```bash
cd flask-server
```
```bash
python3 -m venv venv
```
```bash
source venv/bin/activate
```
```bash
pip install flask python-dotenv
```
```bash
pip install Flask-Cors
```
```bash
python3 server.py
```
or 
```bash
flask --app server run --debug
```
### Windows
```bash 
cd flask-server
```
Create a virtual environment to keep dependencies contained
```bash 
python -m venv venv
```
```bash
venv\Scripts\activate
```
#### (Install dependencies)
```bash
pip install flask python-dotenv
``` 
```bash
pip install Flask-Cors
```
```bash
python server.py
```
or 
```bash
flask --app server run --debug
```
## React (Webpage)
### Install & Run
```bash
cd react-flsk-app
```
```bash
npm install
```
```bash
npm start
```
