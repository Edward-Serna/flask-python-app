from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import json

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
    users = load_users()
    users.append({"username": username, "MachineName": machineName})
    save_users(users)

    return jsonify({"message": "User added successfully!", "username": username, "MachineName": machineName}), 200

if __name__ == '__main__':
    app.run(debug=True)
