from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import subprocess

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"

def load_users():
    try:
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
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
        "username": data.get("username"),
        "machineName": data.get("machineName"),
        "sshKey": data.get("sshKey"),
    })
    save_users(users)

    return jsonify({"message": "User added successfully!", "users": users}), 200


@app.route("/addNetwork", methods=["POST"])
def add_network():
    data = request.get_json()
    if not data or "selectedNetwork" not in data:
        return jsonify({"error": "Invalid request data"}), 400

    selected_network = data["selectedNetwork"].get("SSID")
    password = data.get("password", "")

    if not selected_network:
        return jsonify({"error": "SSID is required"}), 400

    print(f"Connecting to network: {selected_network}")

    try:
        status_result = subprocess.run(["nmcli", "dev", "status"], capture_output=True, text=True, check=True)
        print("Wi-Fi status:\n", status_result.stdout)

        cmd = ["sudo", "nmcli", "dev", "wifi", "connect", selected_network]
        if password:
            cmd += ["password", password]

        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"Successfully connected to {selected_network}")

        users = load_users()
        if users:
            users[-1]["selectedNetwork"] = data["selectedNetwork"]
            save_users(users)
            return jsonify({"message": "Network added to last user", "users": users}), 200

        return jsonify({"error": "No users found to add network"}), 400

    except subprocess.CalledProcessError as e:
        print(f"Failed to connect: {e}")
        return jsonify({"error": f"Failed to connect to {selected_network}: {e.stderr}"}), 400


@app.route("/networks", methods=["GET"])
def networks():
    try:
        networks = []
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

        return jsonify({"networks": networks}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Failed to fetch networks: {e.stderr}"}), 400


if __name__ == "__main__":
    app.run(debug=True)
