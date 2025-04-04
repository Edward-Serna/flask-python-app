from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import subprocess
import uuid 

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
        
@app.route("/GetUsers", methods=["GET"])
def get_users():
    try:
        file_exists = os.path.exists(USERS_FILE)
        if file_exists:
            return jsonify({"fileExists": True}), 200
        return jsonify({"fileExists": False}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/newSSHKey", methods=["GET"])
def new_SSH_Key():
    try:
        ssh_dir = os.path.expanduser("~/.ssh")
        os.makedirs(ssh_dir, exist_ok=True)
        key_filename = f"{ssh_dir}/Wizard/id_rsa_Wizard"

        subprocess.run([
            "ssh-keygen",
            "-t", "rsa",
            "-b", "2048",
            "-f", key_filename,
            "-N", "",
            "-q"
        ], check=True)

        with open(f"{key_filename}.pub", "r") as pub_key_file:
            public_key = pub_key_file.read().strip()

        return jsonify({"message": "SSH key generated successfully!", "sshKey": public_key}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"SSH key generation failed: {e.stderr}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/addUser", methods=["POST"])
def add_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data"}), 400

    users = load_users()
    users.append({
        "UUID": str(uuid.uuid4()),
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

         # Connect to Wi-Fi
        cmd = ["sudo", "nmcli", "device", "wifi", "connect", ssid]
        if password:
            cmd.extend(["password", password])
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)

        # Verify connection
        connection_check = subprocess.run(
            ["nmcli", "-t", "-f", "NAME,DEVICE,ACTIVE", "connection", "show", "--active"],
            capture_output=True, text=True, check=True
        )

        if any(ssid in line for line in connection_check.stdout.strip().split("\n")):
            return jsonify({"message": f"Successfully connected to {ssid}."}), 200

        return jsonify({"message": "Failed to connect to the network. Check credentials."}), 400

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
    app.run(debug=True, host="0.0.0.0", port=5000)
