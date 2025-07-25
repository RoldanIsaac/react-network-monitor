import type { Connection } from "../../core/interfaces/Connection";
import { styles } from "../../styles/styles";
import TableActions from "../TableActions/TableActions";

const getKnowledge = (processName: any) => {
  const name = processName.toLowerCase();

  if (
    [
      "system",
      "svchost.exe",
      "services.exe",
      "lsass.exe",
      "wininit.exe",
    ].includes(name)
  ) {
    return { label: "Sys", color: "#007bff" };
  } else if (
    [
      "chrome.exe",
      "code.exe",
      "slack.exe",
      "telegram.exe",
      "node.exe",
    ].includes(name)
  ) {
    return { label: "Common", color: "#28a745" };
  } else if (["duckduckgo.exe", "figma_agent.exe"].includes(name)) {
    return { label: "Odd", color: "#ffc107" };
  } else {
    return { label: "Unknown", color: "#dc3545" };
  }
};

interface NetworkMonitorProps {
  connections: any;
  onViewDetails: (conn: Connection) => void;
  onKillProcess: (conn: Connection) => void;
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  connections,
  onViewDetails,
  onKillProcess,
}) => {
  const handleOnViewDetails = (conn: Connection) => {
    onViewDetails(conn);
  };

  const handleOnKillProcess = (conn: Connection) => {
    onKillProcess(conn);
  };

  return (
    <div className="container">
      <h1 style={styles.title}>Network Monitor</h1>
      {connections.length === 0 && (
        <p style={{ color: "#888" }}>No active connections found.</p>
      )}

      {connections.length > 0 && (
        <>
          <p style={styles.subtext}>Connections: {connections.length}</p>
          <table className="connection-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Process</th>
                <th>Local</th>
                <th>Remote</th>
                <th>Protocol</th>
                <th>State</th>
                <th>Memory</th>
                <th>Knowledge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn: Connection, index: number) => {
                const knowledge = getKnowledge(conn.process);
                return (
                  <tr key={index}>
                    <td>{conn.pid}</td>
                    <td>{conn.process}</td>
                    <td>{conn.local}</td>
                    <td>{conn.remote}</td>
                    <td>{conn.protocol}</td>
                    <td>{conn.state}</td>
                    <td>{conn.memory.toFixed(2)} MB</td>
                    <td
                      style={{
                        color: knowledge.color,
                        fontWeight: "bold",
                        textAlign: "end",
                      }}
                    >
                      {knowledge.label}
                    </td>
                    <td>
                      <TableActions
                        onKillProcessEmit={() => handleOnKillProcess(conn)}
                        onViewDetailsEmit={() => handleOnViewDetails(conn)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default NetworkMonitor;
