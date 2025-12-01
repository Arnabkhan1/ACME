import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import NetworkMap from './NetworkMap'; 

function App() {
  const [networkData, setNetworkData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [orderLog, setOrderLog] = useState(""); 

  // --- 1. Data Fetching Logic ---
  const fetchData = async () => {
    try {
      // Connect to Python Orchestrator on Port 8000
      const response = await axios.get('http://127.0.0.1:8000/dashboard-data');
      setNetworkData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error connecting to Orchestrator:", error);
    }
  };

  // Auto-refresh every 2 seconds
  useEffect(() => {
    fetchData(); // First load
    const interval = setInterval(fetchData, 2000); // Loop
    return () => clearInterval(interval);
  }, []);

  // --- 2. Smart Order Logic (AI Trigger) ---
  const handleSmartOrder = async () => {
    setOrderLog("🤖 AI Calculating best route...");
    try {
      // Sending request to Python Brain
      const res = await axios.post('http://127.0.0.1:8000/smart-order', { amount: 50 });
      
      if (res.data.success) {
        setOrderLog(`✅ Success! Order routed to: ${res.data.assigned_to}`);
      } else {
        setOrderLog(`❌ Failed: ${res.data.message}`);
      }
    } catch (err) {
      setOrderLog("⚠️ Error: Could not connect to AI Brain.");
    }
  };

  // --- 3. Loading State ---
  if (!networkData) {
    return <div className="loading">📡 Establishing Connection with ACME Neural Net...</div>;
  }

  // --- 4. Main UI Render ---
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>🏭 ACME Industrial Network</h1>
        <p>Autonomous Cognitive Manufacturing Ecosystem | Last Sync: {lastUpdated}</p>
      </header>

      {/* --- SECTION A: GRAPH VISUALIZATION --- */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#94a3b8' }}>🕸️ Real-time Supply Chain Topology</h2>
        {/* Pass backend data to the Map component */}
        <NetworkMap backendData={networkData.nodes} />
      </section>

      {/* --- SECTION B: AI CONTROL PANEL --- */}
      <div className="control-panel">
        <h2 style={{ color: '#38bdf8', marginTop: 0 }}>🧠 Autonomous Order Manager</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
          Simulate a customer order. The AI will automatically select the best Factory based on Health & Cost.
        </p>
        
        <button 
          className="ai-btn"
          onClick={handleSmartOrder}
        >
          🚀 Trigger Smart Order
        </button>

        <div className="log-msg" style={{ 
          color: orderLog.includes('Success') ? '#4ade80' : '#fbbf24' 
        }}>
          {orderLog}
        </div>
      </div>

      {/* --- SECTION C: LIVE CARDS GRID --- */}
      <h2 style={{ color: '#94a3b8' }}>📊 Node Telemetry & AI Prediction</h2>
      <div className="grid-container">
        {Object.entries(networkData.nodes).map(([id, data]) => {
            
            // AI Risk Logic: Color calculation
            const risk = data.failure_risk || 0;
            let riskColor = '#22c55e'; // Green
            if (risk > 50) riskColor = '#facc15'; // Yellow
            if (risk > 80) riskColor = '#ef4444'; // Red

            return (
              <div key={id} className={`card ${data.status === 'OPERATIONAL' ? 'card-green' : 'card-red'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>{id}</h2>
                  <span style={{ fontSize: '0.8em', color: '#64748b' }}>ID: {id.substring(0,3)}</span>
                </div>
                
                <div className="status-badge">
                  {data.status === 'OPERATIONAL' ? '✅ ONLINE' : '⚠️ CRITICAL FAILURE'}
                </div>
                
                <div className="stats">
                  <p><strong>🌡️ Temp:</strong> {data.temperature ? `${data.temperature}°C` : 'N/A'}</p>
                  <p><strong>〰️ Vibration:</strong> {data.vibration || 0} Hz</p>
                  <p><strong>📦 Inventory:</strong> {data.inventory || 0} Units</p>
                </div>

                {/* --- AI RISK METER (PROGRESS BAR) --- */}
                <div className="risk-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <small>🔮 Failure Probability</small>
                      <strong style={{ color: riskColor }}>{risk}%</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${risk}%`, backgroundColor: riskColor }}
                      ></div>
                    </div>
                </div>

                {data.status === 'FAILURE' && (
                  <div className="alert-box">
                    🚨 Rerouting Traffic...
                  </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default App;