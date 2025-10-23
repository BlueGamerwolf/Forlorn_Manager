import json
import os

WARN_FILE = "warnings.json"

def load_warnings():
    if os.path.exists(WARN_FILE):
        with open(WARN_FILE, "r") as f:
            return json.load(f)
    return {}

def save_warnings(data):
    with open(WARN_FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_warning(user_id, reason):
    data = load_warnings()
    user_id = str(user_id)
    if user_id not in data:
        data[user_id] = {"count": 0, "reasons": []}
    data[user_id]["count"] += 1
    data[user_id]["reasons"].append(reason)
    save_warnings(data)
    return data[user_id]["count"], data[user_id]["reasons"]

def get_warnings(user_id):
    data = load_warnings()
    return data.get(str(user_id), {"count": 0, "reasons": []})
