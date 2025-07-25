import React from "react";
import { styles } from "../../styles/styles";

interface TableActionsProps {
  onViewDetailsEmit: () => void;
  onKillProcessEmit: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  onViewDetailsEmit,
  onKillProcessEmit,
}) => {
  return (
    <div>
      <button
        onClick={() => onViewDetailsEmit()}
        style={{ ...styles.button, backgroundColor: "#17a2b8" }}
      >
        Ver
      </button>
      <button
        onClick={() => onKillProcessEmit()}
        style={{ ...styles.button, backgroundColor: "#dc3545" }}
      >
        Eliminar
      </button>
    </div>
  );
};

export default TableActions;
