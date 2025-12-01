🏭 ACME: Autonomous Cognitive Manufacturing Ecosystem

A Self-Healing Industrial AI Network powered by Graph Neural Networks & Predictive Maintenance.

📖 Overview

ACME is a futuristic "Industry 4.0" simulation. It creates a digital twin of a supply chain where factories (Nodes) are autonomous agents. If a factory fails, the central AI Brain automatically reroutes the supply chain to the next best node based on cost and health.

It features a Generative AI Assistant that allows operators to talk to the system naturally.

✨ Key Features

🧠 Intelligent Orchestration: Uses Graph Logic (NetworkX) to find optimal supply routes.

🔮 Predictive Maintenance: Machine Learning model predicts factory failure based on Temperature & Vibration sensors.

❤️ Self-Healing Network: Automatically reroutes traffic if a node fails (Red Node).

💬 FactoryGPT: Built-in AI Chatbot to query system status via natural language.

📊 Digital Twin Dashboard: Glassmorphism UI built with React & React Flow.

🛠️ Tech Stack

Backend: Python, Flask, NetworkX (Graph Algo), Scikit-Learn (AI).

Frontend: React.js, React Flow, CSS3 (Neon/Glassmorphism).

Communication: REST APIs, Real-time polling.

🚀 How to Run Locally

Prerequisites

Python 3.8+

Node.js & npm

1. Setup Backend (The Brain & Agents)

# Clone the repo
git clone [https://github.com/YOUR_USERNAME/ACME_Project.git](https://github.com/YOUR_USERNAME/ACME_Project.git)
cd ACME_Project

# Create Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Dependencies
pip install flask flask-cors networkx scikit-learn numpy requests


2. Run the System (Open 4 Terminal Tabs)

Terminal 1 (Factory A):

python agents/factory_node.py 5001 Factory_A


Terminal 2 (Factory B):

python agents/factory_node.py 5002 Factory_B


Terminal 3 (Supplier):

python agents/factory_node.py 5003 Supplier_X


Terminal 4 (Orchestrator/Brain):

python orchestrator/main.py


3. Run Frontend (Dashboard)

Terminal 5:

cd frontend
npm install
npm start


Access the dashboard at http://localhost:3000.

📸 Screenshots

(You can upload screenshots here later)

Developed by [Arnab Khan]