from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import subprocess

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as file:
            users = json.load(file)
            return users if isinstance(users, list) else []
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)

@app.route("/addUser", methods=["POST"])
def add_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data"}), 400

    users = load_users()
    users.append({
        "UUID": data.get("UUID"),
        "username": data.get("username"),
        "machineName": data.get("machineName"),
        "sshKey": data.get("sshKey"),
    })
    save_users(users)

    return jsonify({"message": "User added successfully!", "users": users}), 200

@app.route("/addNetwork", methods=["POST"])
def add_network():
    try:
        data = request.json
        prevUUID = data.get("prevUUID")
        ssid = data.get("selectedNetwork", {}).get("SSID")
        password = data.get("password", "")

        if not ssid:
            return jsonify({"message": "No network selected"}), 400

        # result = subprocess.run(
        #     ["sudo", "nmcli", "device", "wifi", "connect", ssid, "password", password] if password else
        #     ["sudo", "nmcli", "device", "wifi", "connect", ssid],
        #     capture_output=True, text=True, check=True
        # )

        connection_check = subprocess.run(
            ["nmcli", "-t", "-f", "NAME,DEVICE,ACTIVE", "connection", "show", "--active"],
            capture_output=True, text=True, check=True
        )

        if any(ssid in line for line in connection_check.stdout.strip().split("\n")):
            users = load_users()

            for user in users:
                if user.get("UUID") == prevUUID:
                    user["network"] = {
                        "SSID": ssid,
                        "Security": data.get("selectedNetwork", {}).get("Security", "Unknown")
                    }
                    save_users(users)
                    return jsonify({"message": f"Successfully connected to {ssid} and updated user."}), 200

            return jsonify({"message": "No matching user found for the given UUID."}), 400

        return jsonify({"message": "Failed to connect to the network, please check your credentials."}), 400

    except subprocess.CalledProcessError as e:
        return jsonify({"message": f"{e.stderr}"}), 500


@app.route("/networks", methods=["GET"])
def networks():
    try:
        networks = []
        connected_networks = []

        result = subprocess.run(
            ["nmcli", "-t", "-f", "SSID,SIGNAL,SECURITY", "dev", "wifi", "list"],
            capture_output=True, text=True, check=True
        )

        for line in result.stdout.strip().split("\n"):
            parts = line.split(":")
            if len(parts) >= 2:
                ssid = parts[0].strip()
                signal_percent = int(parts[1].strip()) if parts[1].strip().isdigit() else 0
                security = parts[2].strip() if len(parts) > 2 else "Unknown"

                if ssid and not any(net["SSID"] == ssid for net in networks):
                    networks.append({"SSID": ssid, "Signal_Percent": signal_percent, "Security": security})

        result_connected = subprocess.run(
            ["nmcli", "-t", "-f", "NAME,DEVICE,ACTIVE", "connection", "show", "--active"],
            capture_output=True, text=True, check=True
        )

        for line in result_connected.stdout.strip().split("\n"):
            parts = line.split(":")
            if len(parts) >= 3 and parts[2].strip() == "yes":
                connected_networks.append({"SSID": parts[0].strip(), "Device": parts[1].strip()})

        users = load_users()
        prevUUID = request.args.get("prevUUID")

        for network in connected_networks:
            if network["Device"] == "wlan0":
                for user in users:
                    if user.get("UUID") == prevUUID:
                        user["network"] = {
                            "SSID": network["SSID"],
                            "Security": "Unknown" 
                        }
                        save_users(users)
                        break
                break

        return jsonify({"networks": networks, "connectedNetworks": connected_networks}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Failed to fetch networks: {e.stderr}"}), 400

if __name__ == "__main__":
    app.run(debug=True)
