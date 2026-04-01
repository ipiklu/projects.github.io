import subprocess, time, json, http.server, socketserver, threading, os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from socketserver import ThreadingTCPServer
from urllib.parse import urlparse, parse_qs

# --- CONFIGURATION PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config/config_app.json")
TEMPLATE_FILE = os.path.join(BASE_DIR, "templates/template.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "templates/index.html")

def check_port(user, host, target):
    """Performs the port check via SSH and returns the HTML card with diagnostic link."""
    t_name, t_ip, t_port = target['name'], target['ip'], target['port']
    cmd = ["/usr/bin/ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no",
           f"{user}@{host}", f"timeout 0.5 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'UP' || echo 'DOWN'"]
    try:
        res = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, universal_newlines=True)
        is_up = "UP" in res
    except:
        is_up = False

    status_attr = "UP" if is_up else "DOWN"
    diag_url = f"/diag?ip={t_ip}&port={t_port}&from_host={host}&ssh_user={user}"

    return f'''
    <a href="{diag_url}" 
       onclick="window.open(this.href, '_blank', 'width=950,height=850,scrollbars=yes,resizable=yes'); return false;" 
       style="text-decoration: none; color: inherit;">
        <div class="target-box" data-status="{status_attr}" data-search="{t_name.lower()} {t_ip}">
            <div class="target-inner">
                <div class="target-header">
                    <span class="target-label">{t_name}</span>
                    <div class="status-indicator"></div>
                </div>
                <p class="target-subtext">{t_ip}:{t_port}</p>
            </div>
        </div>
    </a>'''

def process_node(node):
    """Processes a single source node and categories with metadata for dropdowns."""
    src = node.get('remote_source', {})
    h_ip, zone = src.get('host', '0.0.0.0'), src.get('zone', 'NA')
    h_name, user = src.get('hostname', h_ip), src.get('user', 'root')

    with ThreadPoolExecutor(max_workers=40) as executor:
        hlr_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('HLR_targets', []))))
        air_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('AIR_targets', []))))
        inum_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('INUM_targets', []))))

    def make_section(label, content):
        if not content: return ""
        # Added data-category for category dropdown filtering
        return f'''
        <div class="category-section" data-category="{label}">
            <h3 class="network-heading">{label} NETWORK</h3>
            <div class="target-grid">{content}</div>
        </div>'''

    # Added data-zone and data-node for top dropdown filtering
    return f'''
    <div class="source-card" data-zone="{zone}" data-node="{h_name.lower()}">
        <div class="node-header">
            <span class="node-title">{h_name}</span>
            <span class="node-meta">{zone} | {h_ip}</span>
        </div>
        {make_section("HLR", hlr_html)}
        {make_section("AIR", air_html)}
        {make_section("INUM", inum_html)}
    </div>'''

def update_loop():
    """Background thread that refreshes dashboard and calculates counts."""
    while True:
        try:
            if not os.path.exists(CONFIG_FILE):
                time.sleep(5); continue
            with open(CONFIG_FILE, 'r') as f: config = json.load(f)
            
            with ThreadPoolExecutor(max_workers=40) as executor:
                all_cards = "".join(list(executor.map(process_node, config)))
            
            u_count = all_cards.count('data-status="UP"')
            d_count = all_cards.count('data-status="DOWN"')

            with open(TEMPLATE_FILE, 'r') as f: template = f.read()
            
            output = template.replace("{cards}", all_cards) \
                             .replace("{up_count}", str(u_count)) \
                             .replace("{down_count}", str(d_count)) \
                             .replace("{timestamp}", datetime.now().strftime("%H:%M:%S"))
            
            with open(OUTPUT_FILE, "w") as f: f.write(output)
            time.sleep(5)
        except Exception as e:
            print(f"Update Loop Error: {e}"); time.sleep(2)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(BASE_DIR, "templates"), **kwargs)

    def do_GET(self):
        # --- 1. HANDLE PARALLEL REMOTE DIAGNOSTICS ---
        if self.path.startswith('/diag'):
            query = parse_qs(urlparse(self.path).query)
            t_ip = query.get('ip', [None])[0]
            t_port = query.get('port', [None])[0]
            f_host = query.get('from_host', [None])[0]
            s_user = query.get('ssh_user', [None])[0]

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Connection', 'close')
            self.end_headers()

            self.wfile.write(f'''
            <html><head><title>Diagnostics: {t_ip}</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body {{ background: #05070a; color: #94a3b8; font-family: monospace; padding: 20px; }}
                .label {{ color: #e0a419; margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #1e293b; }}
                .con {{ background: #000; padding: 10px; height: 120px; overflow-y: auto; font-size: 11px; border: 1px solid #1e293b; border-radius: 4px; }}
                .chart-box {{ height: 220px; background: rgba(15,23,42,0.5); border: 1px solid #1e293b; padding: 10px; border-radius: 4px; }}
                h3 {{ margin:0; color:#fff; font-size: 16px; }}
            </style>
            </head><body>
            <h3>DIAGNOSTICS: {f_host} &rarr; {t_ip}:{t_port}</h3>
            <div class="label">Latency Graph (Ping)</div>
            <div class="chart-box"><canvas id="ch"></canvas></div>
            <div class="label">Ping Raw Output</div><div id="p-con" class="con"></div>
            <div class="label">Traceroute</div><div id="tr-con" class="con" style="height: 150px;"></div>
            <div class="label">Telnet Check (Port: {t_port})</div><div id="te-con" class="con" style="height: 100px;"></div>

            <script>
                const ctx = document.getElementById('ch').getContext('2d');
                const chart = new Chart(ctx, {{
                    type: 'line',
                    data: {{ labels: [], datasets: [{{ label: 'ms', data: [], borderColor: '#10b981', fill: true, tension: 0.4 }}] }},
                    options: {{ responsive: true, maintainAspectRatio: false, plugins: {{ legend: {{display: false}} }}, scales: {{ y: {{ beginAtZero: true }} }} }}
                }});

                function log(id, text) {{
                    const c = document.getElementById(id);
                    const d = document.createElement('div');
                    if (text.includes('SUCCESS') || text.includes('OPEN') || text.includes('Connected')) {{
                        d.style.color = '#10b981'; d.style.fontWeight = 'bold';
                    }} else if (text.includes('FAILED') || text.includes('CLOSED') || text.includes('failed')) {{
                        d.style.color = '#ef4444'; d.style.fontWeight = 'bold';
                    }}
                    d.textContent = text;
                    c.appendChild(d);
                    c.scrollTop = c.scrollHeight;
                    if(id === 'p-con') {{
                        const m = text.match(/time=([\\d\\.]+)\\s*ms/);
                        if(m) {{
                            chart.data.labels.push("");
                            chart.data.datasets[0].data.push(parseFloat(m[1]));
                            if(chart.data.labels.length > 30) {{ chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }}
                            chart.update('none');
                        }}
                    }}
                }}
            </script>
            '''.encode())
            self.wfile.flush()

            write_lock = threading.Lock()
            def run_command(div_id, cmd_str):
                ssh_cmd = ["/usr/bin/ssh", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no", f"{s_user}@{f_host}", cmd_str]
                try:
                    with subprocess.Popen(ssh_cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as p:
                        for line in p.stdout:
                            l = line.strip().replace("'", "\\'")
                            with write_lock:
                                self.wfile.write(f"<script>log('{div_id}', '{l}');</script>".encode())
                                self.wfile.flush()
                except Exception as e:
                    with write_lock:
                        self.wfile.write(f"<script>log('{div_id}', 'Error: {e}');</script>".encode())
                        self.wfile.flush()

            # Telnet logic: mimic terminal behavior with Trying, Connected, and status
            diag_cmds = [
                ("p-con", f"ping -c 20 {t_ip}"),
                ("tr-con", f"traceroute -n -m 30 {t_ip}"),
                ("te-con", f"echo 'Trying {t_ip}...'; "
                           f"timeout 2 bash -c '</dev/tcp/{t_ip}/{t_port}' && "
                           f"(echo 'Connected to {t_ip}.'; echo 'SUCCESS: Port {t_port} is OPEN') || "
                           f"(echo 'Connect to {t_ip} port {t_port} failed.'; echo 'FAILED: Port {t_port} is CLOSED')")
            ]

            threads = []
            for d_id, cmd in diag_cmds:
                th = threading.Thread(target=run_command, args=(d_id, cmd))
                th.start()
                threads.append(th)

            for th in threads: th.join()
            self.wfile.write(b"</body></html>")
            return

        if self.path == '/' or self.path == '': self.path = '/index.html'
        return super().do_GET()

    def address_string(self): return self.client_address[0]
    def log_message(self, format, *args): return

if __name__ == "__main__":
    threading.Thread(target=update_loop, daemon=True).start()
    ThreadingTCPServer.allow_reuse_address = True
    with ThreadingTCPServer(("", 8000), Handler) as httpd:
        print("------------------------------------------")
        print("NOC DASHBOARD LOADED SUCCESSFULLY")
        print("DIAGNOSTICS PARALLEL MODE ACTIVE")
        print("------------------------------------------")
        httpd.serve_forever()
