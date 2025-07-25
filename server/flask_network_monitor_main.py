# server.py
from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import psutil
import time
from collections import defaultdict
import threading

app = Flask(__name__)
CORS(app)  # Habilitar CORS para React

# Datos compartidos
network_data = {
    'connections': [],
    'traffic': defaultdict(lambda: {'upload': 0, 'download': 0})
}

def get_network_data_enhancement():
    """Obtiene datos de red y actualiza el diccionario compartido"""
    while True:
        try:
            # Ejecutar netstat y procesar resultados
            result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
            # result = subprocess.run(['netstat', '-bno'], capture_output=True, text=True)
            lines = result.stdout.splitlines()
            
            connections = []
            for line in lines:
                if 'ESTABLISHED' in line or 'LISTENING' in line:
                    parts = [p for p in line.split() if p]
                    if len(parts) >= 5:
                        protocol = parts[0]
                        local = parts[1]
                        remote = parts[2]
                        # remote = parts[2] if len(parts) > 2 else '-'
                        state = parts[3]
                        # state = parts[3] if len(parts) > 3 else '-'
                        pid = parts[4]

                        try:
                            process = psutil.Process(int(pid))
                            name = process.name()
                            mem = process.memory_info().rss / (1024 * 1024)
                        except (psutil.NoSuchProcess, psutil.AccessDenied):
                            name = "Unknown"
                            mem = 0
                        
                        conn_id = f"{pid}-{local}-{remote}"
                        connections.append({
                            'pid': pid,
                            'protocol': protocol,
                            'local': local,
                            'remote': remote,
                            'state': state,
                            'process': name,
                            'memory': mem,
                            'conn_id': conn_id
                        })
            
            network_data['connections'] = connections
            time.sleep(5)
        
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(10)
                                     


@app.route('/api/connections', methods=['GET'])
def get_connections():
    """Endpoint para obtener conexiones"""
    return jsonify({
        'connections': network_data['connections'],
        'traffic': network_data['traffic']
    })

@app.route('/api/process/<int:pid>', methods=['GET'])
def get_process_details(pid):
    """Endpoint para obtener detalles de un proceso"""
    return jsonify({
        'status': 'success',
        'process': network_data['connections'][pid]
    })


@app.route('/api/kill/<int:pid>', methods=['DELETE'])
def kill_process(pid):
    """Endpoint para terminar un proceso"""
    try:
        process = psutil.Process(pid)
        process.terminate()
        return jsonify({'status': 'success', 'message': f'Process {pid} terminated'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    # Iniciar hilo para monitoreo de red
    monitor_thread = threading.Thread(target=get_network_data_enhancement, daemon=True)
    monitor_thread.start()
    
    # Iniciar servidor Flask
    app.run(port=5000, debug=True)


    # # Monitorear tráfico
    # io = process.io_counters()
    # if conn_id in network_data['traffic']:
    #     upload = io.write_bytes - network_data['traffic'][conn_id]['last_write']
    #     download = io.read_bytes - network_data['traffic'][conn_id]['last_read']
    #     network_data['traffic'][conn_id]['upload'] += upload / (1024 * 1024)
    #     network_data['traffic'][conn_id]['download'] += download / (1024 * 1024)
    
    # network_data['traffic'][conn_id].update({
    #     'last_write': io.write_bytes,
    #     'last_read': io.read_bytes,
    #     'process': name,
    #     'pid': pid
    # })