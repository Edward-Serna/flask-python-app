import subprocess
import platform
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import json

import sdbus
from sdbus_block.networkmanager import (
    NetworkConnectionSettings,
    NetworkManager,
    NetworkManagerSettings,
)

app = Flask(__name__)
CORS(app)

def load_users():
    try:
        with open('users.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_users(users):
    with open('users.json', 'w') as file:
        json.dump(users, file)

def get_signal_strength():
    system = platform.system()

    if system == "Windows":
        command = "netsh wlan show interfaces"
        process = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
        output, error = process.communicate()

        for line in output.split(b'\n'):
            if b"Signal" in line:
                strength_percent = int(line.split(b':')[1].strip().replace(b'%', b''))
                strength_dbm = (strength_percent / 2) - 100
                return strength_dbm, strength_percent

    elif system == "Linux":
        command = "iwconfig"
        process = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
        output, error = process.communicate()

        for line in output.split(b'\n'):
            if b"Signal level" in line:
                strength_dbm = int(line.split(b'=')[2].split(b' ')[0])
                strength_percent = ((strength_dbm + 100) * 2)
                return strength_dbm, strength_percent

    else:
        print("Unsupported system.")
        return None

@app.route("/addUser", methods=["POST"])
def add_user():
    data = request.get_json()
    username = data.get('username')
    machineName = data.get('machineName')
    sshKey = data.get('sshKey')
    users = load_users()
    users.append({"username": username, "machineName": machineName, "sshKey": sshKey})
    save_users(users)
    return jsonify({"message": "User added successfully!", "username": username, "MachineName": machineName, "sshKey": sshKey}), 200

@app.route("/addNetwork", methods=["POST"])
def add_network():
    data = request.get_json()
    selectedNetwork = data.get('selectedNetwork')
    users = load_users()

    if len(users) > 0:
        users[-1].update({"selectedNetwork": selectedNetwork})
        save_users(users)
        return jsonify({"message": "Added Network to the last user", "users": users}), 200
    else:
        return jsonify({"error":"No users found to add network"}), 400

@app.route("/networks")
def networks_endpoint():
    try:
        # Initialize the system bus and NetworkManager
        sdbus.set_default_bus(sdbus.sd_bus_open_system())
        network_manager = NetworkManager()

        # Fetch all devices managed by NetworkManager
        # Example of fetching devices
        devices = network_manager.get_devices()  # This might be the correct method
        print("Devices:", devices)

        for device in devices:
            print("Device:", device)
            if device.device_type == "wifi":
                access_points = device.get_access_points()
                print("Access Points:", access_points)
                
                for ap in access_points:
                    ssid = ap.ssid
                    signal_strength_dbm = ap.signal_strength
                    signal_percent = max(0, min(100, (signal_strength_dbm + 100) * 2))
                    
                    available_networks.append({
                        "SSID": ssid,
                        "Signal_Strength": signal_strength_dbm,
                        "Signal_Percent": signal_percent
                    })


        return jsonify({"networks": available_networks}), 200

    except Exception as e:
        print("Error occurred:", e)  # Debugging line to capture the exception
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
