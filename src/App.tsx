import NetworkMonitor from "./components/network-monitor/NetworkMonitor";
import { useState } from "react";

interface Connection {
  conn_id: string;
  local: string;
  remote: string;
  protocol: string;
  state: string;
  memory: number;
  pid: number;
  process: string;
}

const App = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  fetch("http://localhost:5000/api/connections").then((res) => {
    console.log("Response received:", res);
    res.json().then((data) => {
      console.log("Data received:", data);
      setConnections(data.connections || []);
    });
  });

  return (
    <div>
      <NetworkMonitor
        connections={connections}
        onKillProcess={(conn) => {
          fetch(`/api/kill/${conn.pid}`, { method: "DELETE" });
        }}
        onViewDetails={(conn) => {
          alert(`Detalles de ${conn.process} (PID ${conn.pid})`);
        }}
      />
    </div>
  );
};

export default App;
