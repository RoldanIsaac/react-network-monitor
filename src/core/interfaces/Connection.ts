export interface Connection {
  conn_id: string;
  local: string;
  remote: string;
  protocol: string;
  state: string;
  memory: number;
  pid: number;
  process: string;
}
