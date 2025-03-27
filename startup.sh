#!/bin/bash
echo "Stopping any existing Flask API and Next.js app..."
# Kill Flask server
sudo pkill -f "python3 server.py"
# Kill Next.js (dev and production modes)
sudo pkill -f "node.*next"
sudo pkill -f "npm.*dev"
sudo pkill -f "npm.*start"
sleep 2

echo "Starting Flask API..."
cd ~/Wizard/flask-python-app/flask-server || exit
source venv/bin/activate
nohup flask run --host=192.168.1.107 --port=5000 > ~/Wizard/flask-python-app/.Logs/flask.log 2>&1 &

echo "Starting Next.js app..."
cd ~/Wizard/flask-python-app/react-app-next || exit
npm run dev > ~/Wizard/flask-python-app/.Logs/react.log 2>&1 &

echo "Startup script executed successfully!"
