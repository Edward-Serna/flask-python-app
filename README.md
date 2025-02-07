<img src="./react-app/public/Modifly_Logo.svg" height="50"><br>
# Getting Started Wizard
Start up page using React as frontend and Flask for backend.

## Prerequisites
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

## Flask (API Server)
```bash
cd flask-server
```
If no env available:
```bash
python3 -m venv venv
```
```bash
source venv/bin/activate
```
```bash
pip install -r requirements.txt
```
Run Flask API:
```bash
python3 server.py
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
npm install --force
```
```bash
npm start
```
### Build
```bash
npm run build
serve -s build
```

