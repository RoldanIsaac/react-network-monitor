import NetworkMonitor from "./components/NetworkMonitor/NetworkMonitor";
import { useState } from "react";
import type { Connection } from "./core/interfaces/Connection";

const App = () => {
  const apiUrl = "http://localhost:5000/api";
  const [connections, setConnections] = useState<Connection[]>([]);

  fetch(`${apiUrl}/connections`).then((res) => {
    // console.log("Response received:", res);
    res.json().then((data) => {
      //   console.log("Data received:", data);
      setConnections(data.connections || []);
    });
  });

  const handleProcessDetails = (conn: Connection) => {
    console.log("Process details for connection:", conn);
    fetch(`${apiUrl}/process/${conn.pid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Process details:", data);
        alert(
          `Process Details:\nPID: ${data.pid}\nName: ${data.name}\nStatus: ${data.status}`
        );
      })
      .catch((error) => {
        console.error("Error fetching process details:", error);
      });
  };

  const handleKillProcess = (pid: number) => {
    console.log("Killing process with PID:", pid);
    fetch(`${apiUrl}/kill/${pid}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setConnections((prev) => prev.filter((conn) => conn.pid !== pid));
          alert("successfully killed process with PID " + pid);
        } else {
          console.error("Failed to kill process:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error killing process:", error);
      });
  };

  return (
    <div>
      <NetworkMonitor
        connections={connections}
        onKillProcess={(conn) => {
          handleKillProcess(conn.pid);
        }}
        onViewDetails={(conn) => {
          handleProcessDetails(conn);
        }}
      />
    </div>
  );
};

export default App;
