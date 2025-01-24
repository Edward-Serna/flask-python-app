from flask import Flask, request, jsonify
from flask_cors import CORS
import json

import sdbus

from sdbus_block.networkmanager import (
    NetworkDeviceGeneric,
    NetworkConnectionSettings,
    NetworkManagerSettings,
    NetworkDeviceWireless,
    NetworkManager,
    NetworkDeviceWireless
)
from sdbus_block.networkmanager.enums import DeviceType
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
        sdbus.set_default_bus(sdbus.sd_bus_open_system())
        network_manager = NetworkManager()
        networwork_manager_settings = NetworkManagerSettings()

        connection = NetworkConnectionSettings(networwork_manager_settings.connections[0])
        setting_dataclass = connection.get_profile()

        return jsonify({"message": setting_dataclass}), 200
        # system_bus = sd_bus_open_system()  # We need system bus

        # nm = NetworkManager(system_bus)

        # devices_paths = nm.get_devices()

        # for device_path in devices_paths:
        #     generic_device = NetworkDeviceGeneric(device_path, system_bus)
        #     print('Device: ', generic_device.interface)
        #     device_ip4_conf_path = generic_device.ip4_config
        #     if device_ip4_conf_path == '/':
        #         # This is how NetworkManager indicates there is no ip config
        #         # for the interface
        #         continue
        #     else:
        #         ip4_conf = IPv4Config(device_ip4_conf_path, system_bus)
        #         for address_data in ip4_conf.address_data:
        #             print('     Ip Address:', address_data['address'][1])
        # return none

    except Exception as e:
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
