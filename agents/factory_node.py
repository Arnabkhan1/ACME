import sys
import random
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

NODE_PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
NODE_ID = sys.argv[2] if len(sys.argv) > 2 else "Factory_Unknown"

# State definition
state = {
    "id": NODE_ID,
    "status": "OPERATIONAL",
    "inventory": 1000,
    "temperature": 40.0,
    "vibration": 10.0  # <--- NEW SENSOR (Normal is 0-20)
}

@app.route('/status', methods=['GET'])
def get_status():
    # 1. Simulate Sensor Data
    # Temperature fluctuates
    state['temperature'] = round(random.uniform(35.0, 95.0), 2)
    # Vibration fluctuates
    state['vibration'] = round(random.uniform(5.0, 60.0), 2)

    # 2. Real-world Logic: High Temp + High Vibration = FAILURE
    if state['temperature'] > 90 and state['vibration'] > 50:
        state['status'] = "FAILURE"
    elif random.random() < 0.05: # 5% random chance of failure
        state['status'] = "FAILURE"
    else:
        state['status'] = "OPERATIONAL"
        
    return jsonify(state)

@app.route('/order', methods=['POST'])
def process_order():
    # (Order logic same as before)
    if state['status'] != "OPERATIONAL":
        return jsonify({"success": False, "error": "Factory Down"}), 503
    state['inventory'] -= request.json.get('amount', 0)
    return jsonify({"success": True, "remaining": state['inventory']})

if __name__ == '__main__':
    print(f"🤖 Agent {NODE_ID} (Sensors Active) running on {NODE_PORT}...")
    app.run(port=NODE_PORT)