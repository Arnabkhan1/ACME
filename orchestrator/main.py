import time
import requests
import threading
import pickle
import numpy as np
import networkx as nx
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Load AI Model ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ai_models', 'factory_model.pkl')
try:
    with open(MODEL_PATH, 'rb') as f:
        ml_model = pickle.load(f)
    print("✅ AI Model Loaded Successfully!")
except:
    print("⚠️ Warning: Model not found. Please run train_ai.py")
    ml_model = None

# --- Config ---
AGENTS = {
    "Factory_A": {"url": "http://127.0.0.1:5001", "cost": 10},
    "Factory_B": {"url": "http://127.0.0.1:5002", "cost": 20},
    "Supplier_X": {"url": "http://127.0.0.1:5003", "cost": 5}
}

network_state = {}

def get_best_route():
    # (Same Logic as before - removed for brevity, assume simple cost check)
    valid_nodes = [n for n, d in network_state.items() if d.get('status') == 'OPERATIONAL']
    if not valid_nodes: return None
    
    # Simple logic: Find lowest cost
    best_node = min(valid_nodes, key=lambda n: AGENTS[n]['cost'])
    return best_node

def monitor_network():
    while True:
        for agent_id, info in AGENTS.items():
            try:
                response = requests.get(f"{info['url']}/status", timeout=2)
                if response.status_code == 200:
                    data = response.json()
                    
                    # --- NEW: AI PREDICTION LOGIC ---
                    if ml_model and 'temperature' in data and 'vibration' in data:
                        # Prepare data for AI [Temp, Vib]
                        features = np.array([[data['temperature'], data['vibration']]])
                        # Predict probability of failure (Risk Score)
                        risk_prob = ml_model.predict_proba(features)[0][1] 
                        data['failure_risk'] = round(risk_prob * 100, 2) # e.g., 85.5%
                    else:
                        data['failure_risk'] = 0

                    network_state[agent_id] = data
                else:
                    network_state[agent_id] = {"status": "ERROR", "failure_risk": 100}
            except:
                network_state[agent_id] = {"status": "OFFLINE", "failure_risk": 100}
        time.sleep(2)

monitor_thread = threading.Thread(target=monitor_network)
monitor_thread.daemon = True
monitor_thread.start()

# --- Endpoints ---
@app.route('/dashboard-data', methods=['GET'])
def get_dashboard_data():
    return jsonify({
        "timestamp": time.time(),
        "nodes": network_state
    })

@app.route('/smart-order', methods=['POST'])
def place_smart_order():
    best_factory = get_best_route()
    if not best_factory:
        return jsonify({"success": False, "message": "All Systems Down!"})
    
    # Check Predictive Risk
    risk = network_state[best_factory].get('failure_risk', 0)
    msg = f"Routed to {best_factory}."
    
    if risk > 70:
        msg += f" ⚠️ WARNING: High Risk ({risk}%) detected!"

    # Simulate Order
    try:
        requests.post(f"{AGENTS[best_factory]['url']}/order", json={"amount": 10})
        return jsonify({"success": True, "assigned_to": best_factory, "message": msg})
    except:
        return jsonify({"success": False, "message": "Connection Failed"})

if __name__ == '__main__':
    print("🧠 Orchestrator (Predictive AI) starting on Port 8000...")
    app.run(port=8000, debug=True)