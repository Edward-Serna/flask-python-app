<img src="./react-app-next/public/Modifly_Logo.svg" height="50"><br>
# Getting Started Wizard
Start up page using React as frontend and Flask for backend.

## Prerequisites [Linux]
```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt install python3.12-venv
sudo apt install python3-pip
sudo pip3 install flask-restful 
```

```bash
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# OR
sudo apt install nodejs

# Download and install Node.js:
fnm install 23
# Verify the Node.js version:
node -v # Should print "v23.10.0".
# Verify npm version:
npm -v # Should print "10.9.2".
```

## Flask (API Server)
```bash
cd flask-server
```
If no env available:
`` bash
sudo pip3 install flask-restful 
```

```bash
sudo python3 -m venv venv
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
## Useful Reasources
* https://flask.palletsprojects.com/en/stable/
* https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/
* https://auth0.com/blog/developing-restful-apis-with-python-and-flask/
* https://react.dev/
* https://medium.com/@ahmetfurkandemir/deploy-the-python-flask-website-f43fcc5f2c80
