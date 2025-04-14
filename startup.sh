#!/bin/bash

echo "Stopping any existing Flask API and Next.js app..."

# Kill Flask server by script name or by port 5000
sudo pkill -f "python3 server.py"
sudo lsof -ti :5000 | xargs -r sudo kill -9

# Kill Next.js processes (dev, build, or production)
sudo pkill -f "node.*next"
sudo pkill -f "npm.*dev"
sudo pkill -f "npm.*start"
sudo lsof -ti :3000 | xargs -r sudo kill -9

sleep 2

echo "Starting Flask API..."
cd ~/Wizard/flask-python-app/flask-server || exit
source venv/bin/activate
nohup flask run --host=192.168.1.107 --port=5000 > ~/Wizard/flask-python-app/.Logs/flask.log 2>&1 &

echo "Starting Next.js app..."
cd ~/Wizard/flask-python-app/react-app-next || exit
nohup npm run dev > ~/Wizard/flask-python-app/.Logs/react.log 2>&1 &

echo "Startup script executed successfully!"