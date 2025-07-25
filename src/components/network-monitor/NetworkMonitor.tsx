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
    return { label: "Sistema", color: "#007bff" };
  } else if (
    [
      "chrome.exe",
      "code.exe",
      "slack.exe",
      "telegram.exe",
      "node.exe",
    ].includes(name)
  ) {
    return { label: "Común", color: "#28a745" };
  } else if (["duckduckgo.exe", "figma_agent.exe"].includes(name)) {
    return { label: "Extraño", color: "#ffc107" };
  } else {
    return { label: "Desconocido", color: "#dc3545" };
  }
};

interface NetworkMonitorProps {
  connections: any;
  onKillProcess: (conn: Connection) => void;
  onViewDetails: (conn: Connection) => void;
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  connections,
  onKillProcess,
  onViewDetails,
}) => {
  const styles = {
    container: {
      fontFamily: "Segoe UI, sans-serif",
      backgroundColor: "#f4faff",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 4px 10px rgba(0, 123, 255, 0.1)",
      maxWidth: "1000px",
      margin: "40px auto",
    },
    title: {
      color: "#0077cc",
      fontSize: "2rem",
      marginBottom: "10px",
    },
    subtext: {
      color: "#555",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
    },
    th: {
      backgroundColor: "#e6f0fb",
      color: "#333",
      textAlign: "left",
      padding: "12px 16px",
      fontWeight: "600",
      fontSize: "14px",
      borderBottom: "1px solid #d0e4fa",
    },
    td: {
      padding: "12px 16px",
      fontSize: "14px",
      color: "#444",
      borderBottom: "1px solid #f0f4f8",
    },
    row: {
      transition: "background 0.2s ease",
    },
    button: {
      padding: "6px 10px",
      marginRight: "6px",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Network Monitor</h1>
      <p style={styles.subtext}>Connections: {connections.length}</p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>PID</th>
            <th style={styles.th}>Process</th>
            <th style={styles.th}>Local</th>
            <th style={styles.th}>Remote</th>
            <th style={styles.th}>Protocol</th>
            <th style={styles.th}>State</th>
            <th style={styles.th}>Memory</th>
            <th style={styles.th}>Knowledge</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, index) => {
            const knowledge = getKnowledge(conn.process);
            return (
              <tr key={index} style={styles.row}>
                <td style={styles.td}>{conn.pid}</td>
                <td style={styles.td}>{conn.process}</td>
                <td style={styles.td}>{conn.local}</td>
                <td style={styles.td}>{conn.remote}</td>
                <td style={styles.td}>{conn.protocol}</td>
                <td style={styles.td}>{conn.state}</td>
                <td style={styles.td}>{conn.memory.toFixed(2)} MB</td>
                <td
                  style={{
                    ...styles.td,
                    color: knowledge.color,
                    fontWeight: "bold",
                  }}
                >
                  {knowledge.label}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => onViewDetails(conn)}
                    style={{ ...styles.button, backgroundColor: "#17a2b8" }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onKillProcess(conn)}
                    style={{ ...styles.button, backgroundColor: "#dc3545" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NetworkMonitor;
