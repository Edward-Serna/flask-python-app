#!/bin/bash

echo "Stopping any existing Flask API and React app..."
sudo pkill -f "python3 server.py"
sudo pkill -f "npm start"
sudo pkill -f "node .*react-scripts"
sleep 2

echo "Starting Flask API..."
cd /home/usl/Wizard/flask-python-app/flask-server || exit
source venv/bin/activate
nohup python3 server.py > /home/usl/Wizard/flask-python-app/flask.log 2>&1 &

echo "Starting React app..."
cd /home/usl/Wizard/flask-python-app/react-app || exit
nohup npm start > /home/usl/Wizard/flask-python-app/react.log 2>&1 &

echo "Startup script executed successfully."
