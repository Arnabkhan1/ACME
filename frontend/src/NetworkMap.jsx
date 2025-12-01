import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Graph-e node gulo kothay thakbe (Fixed Position)
const initialNodes = [
  { id: 'Supplier_X', position: { x: 250, y: 0 }, data: { label: '📦 Supplier X' }, style: { background: '#fff', border: '1px solid #777', width: 150 } },
  { id: 'Factory_A', position: { x: 100, y: 200 }, data: { label: '🏭 Factory A' }, style: { background: '#fff', border: '1px solid #777', width: 150 } },
  { id: 'Factory_B', position: { x: 400, y: 200 }, data: { label: '🏭 Factory B' }, style: { background: '#fff', border: '1px solid #777', width: 150 } },
];

// Supply Chain Connections (Ke kar sathe connected)
const initialEdges = [
  { id: 'e1-2', source: 'Supplier_X', target: 'Factory_A', animated: true, style: { stroke: '#00ff00' } },
  { id: 'e1-3', source: 'Supplier_X', target: 'Factory_B', animated: true, style: { stroke: '#00ff00' } },
  { id: 'e2-3', source: 'Factory_A', target: 'Factory_B', animated: false, style: { stroke: '#555', strokeDasharray: 5 } }, // Backup line
];

const NetworkMap = ({ backendData }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Jokhon Backend theke data ashbe, Node-er color change hobe
  useEffect(() => {
    if (!backendData) return;

    setNodes((nds) =>
      nds.map((node) => {
        const nodeStatus = backendData[node.id]; // Backend theke status paowa
        
        // Default style
        let newStyle = { ...node.style, background: '#fff', color: 'black' };

        // Jodi backend data thake
        if (nodeStatus) {
          if (nodeStatus.status === 'OPERATIONAL') {
            newStyle.background = '#dcfce7'; // Light Green
            newStyle.border = '2px solid #22c55e';
          } else if (nodeStatus.status === 'FAILURE') {
            newStyle.background = '#fee2e2'; // Light Red
            newStyle.border = '2px solid #ef4444';
          }
          // Update Label with Live Temp
          node.data = { 
            ...node.data, 
            label: `${node.id.replace('_', ' ')} (${nodeStatus.temperature || 0}°C)` 
          };
        }
        return { ...node, style: newStyle };
      })
    );

    // Jodi Factory A fail kore, backup line activate koro (Smart Visualization)
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === 'e2-3') { // Factory A <-> Factory B Line
             const factoryA = backendData['Factory_A'];
             if (factoryA && factoryA.status === 'FAILURE') {
                 return { ...edge, animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } }; // Orange Line (Reroute)
             }
        }
        return edge;
      })
    );

  }, [backendData]);

  return (
    <div style={{ height: '400px', border: '1px solid #333', borderRadius: '10px', background: '#1e1e1e' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#888" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NetworkMap;