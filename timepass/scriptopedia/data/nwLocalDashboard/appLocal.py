import socket, time, json, http.server, socketserver, threading, os, subprocess
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# --- CONFIGURATION PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config/config_appLocal.json")
TEMPLATE_FILE = os.path.join(BASE_DIR, "templates/templateLocal.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "templates/index.html")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80)); addr = s.getsockname()[0]; s.close()
        return addr
    except: return "127.0.0.1"

def telnet_check(ip, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.settimeout(1.0)
    try: s.connect((ip, int(port))); return True
    except: return False
    finally: s.close()

def update_loop():
    while True:
        try:
            if not os.path.exists(CONFIG_FILE): time.sleep(5); continue
            with open(CONFIG_FILE, 'r') as f: conf_list = json.load(f)
            all_sections_html = ""; f_host = get_local_ip()

            for entry in conf_list:
                cat_key = next((k for k in entry.keys() if k.endswith("_targets")), None)
                if not cat_key: continue
                cat_name = cat_key.replace("_targets", "")
                target_html = ""; c_up = 0; c_down = 0

                for nw in entry[cat_key]:
                    is_up = telnet_check(nw['ip'], nw['port'])
                    status = "UP" if is_up else "DOWN"
                    if is_up: c_up += 1 
                    else: c_down += 1
                    
                    diag_url = f"/diag?ip={nw['ip']}&port={nw['port']}&name={nw['name']}&f_host={f_host}"
                    target_html += f'''
                    <div class="target-box" data-status="{status}" data-search="{nw['name'].lower()} {nw['ip']}" 
                         onclick="window.open('{diag_url}', '_blank', 'width=950,height=950,scrollbars=yes');">
                        <div class="target-header">
                            <span class="target-label">{nw['name']}</span>
                            <div class="status-indicator"></div>
                        </div>
                        <p class="target-subtext">{nw['ip']}:{nw['port']}</p>
                    </div>'''

                all_sections_html += f'''
                <div class="category-section mb-6" data-category="{cat_name}">
                    <h3 class="network-heading">{cat_name} NETWORK <span class="section-counter">(<span class="cnt-up">{c_up} UP</span> / <span class="cnt-down">{c_down} DOWN</span>)</span></h3>
                    <div class="target-grid">{target_html}</div>
                </div>'''

            final_cards = f'''<div class="source-card">{all_sections_html}</div>'''
            if os.path.exists(TEMPLATE_FILE):
                with open(TEMPLATE_FILE, 'r') as f: template = f.read()
                output = template.replace("{cards}", final_cards).replace("{timestamp}", datetime.now().strftime("%H:%M:%S"))
                with open(OUTPUT_FILE, "w") as f: f.write(output)
            time.sleep(5)
        except Exception as e: print(f"Loop Error: {e}"); time.sleep(5)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(BASE_DIR, "templates"), **kwargs)

    def do_GET(self):
        if self.path.startswith('/diag'):
            query = parse_qs(urlparse(self.path).query)
            t_ip = query.get('ip', [''])[0]
            t_port = query.get('port', [''])[0]
            f_host = query.get('f_host', ['localhost'])[0]
            
            self.send_response(200); self.send_header('Content-type', 'text/html'); self.end_headers()
            
            # --- DIAGNOSTIC POPUP WITH YOUR EXACT CHART CONFIG ---
            self.wfile.write(f'''
            <html><head><title>Diag: {t_ip}</title><script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body {{ background: #05070a; color: #94a3b8; font-family: monospace; padding: 20px; }}
                .label {{ color: #e0a419; margin: 15px 0 5px 0; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #1e293b; }}
                .con {{ background: #000; padding: 10px; height: 120px; overflow-y: auto; font-size: 11px; border: 1px solid #1e293b; border-radius: 4px; }}
                .chart-box {{ height: 200px; background: rgba(15,23,42,0.5); border: 1px solid #1e293b; padding: 10px; border-radius: 4px; }}
                h3 {{ margin:0; color:#fff; }}
            </style></head><body>
            <h3>DIAGNOSTICS: {f_host} &rarr; {t_ip}:{t_port}</h3>
            
            <div class="label">Latency Graph (Ping)</div>
            <div class="chart-box"><canvas id="ch"></canvas></div>
            
            <div class="label">Ping Raw Output</div><div id="p-con" class="con"></div>
            <div class="label">Traceroute</div><div id="tr-con" class="con" style="height:150px;"></div>
            <div class="label">Telnet {t_ip} (Port: {t_port})</div><div id="te-con" class="con" style="height:80px;"></div>
            
            <script>
                const ctx = document.getElementById('ch').getContext('2d');
                const chart = new Chart(ctx, {{
                    type: 'line',
                    data: {{ 
                        labels: [], 
                        datasets: [{{ 
                            label: 'ms', 
                            data: [], 
                            borderColor: '#10b981', 
                            fill: true, 
                            tension: 0.4 
                        }}] 
                    }},
                    options: {{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: {{ legend: {{display: false}} }}, 
                        scales: {{ y: {{ beginAtZero: true }} }} 
                    }}
                }});

                function log(id, text) {{
                    const c = document.getElementById(id); const d = document.createElement('div');
                    if (text.includes('SUCCESS') || text.includes('OPEN')) d.style.color = '#10b981';
                    else if (text.includes('FAILED')) d.style.color = '#ef4444';
                    d.textContent = text; c.appendChild(d); c.scrollTop = c.scrollHeight;
                    
                    if(id === 'p-con') {{
                        const m = text.match(/time=([\\d\\.]+)\\s*ms/);
                        if(m) {{
                            chart.data.labels.push(""); 
                            chart.data.datasets[0].data.push(parseFloat(m[1]));
                            if(chart.data.labels.length > 20) {{ 
                                chart.data.labels.shift(); 
                                chart.data.datasets[0].data.shift(); 
                            }}
                            chart.update('none');
                        }}
                    }}
                }}
            </script>'''.encode())
            self.wfile.flush()

            def run_local(div_id, cmd):
                with subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as p:
                    for line in p.stdout:
                        l = line.strip().replace("'", "\\'")
                        self.wfile.write(f"<script>log('{div_id}', '{l}');</script>".encode()); self.wfile.flush()

            diag_cmds = [
                ("p-con", f"ping -c 20 {t_ip}"), 
                ("tr-con", f"traceroute -n -m 30 {t_ip}"), 
                ("te-con", f"echo 'Testing {t_ip}:{t_port}...'; timeout 2 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'SUCCESS: Port OPEN' || echo 'FAILED: Port CLOSED'")
            ]
            threads = [threading.Thread(target=run_local, args=(cid, cmd)) for cid, cmd in diag_cmds]
            for t in threads: t.start()
            for t in threads: t.join()
            self.wfile.write(b"</body></html>"); return
        return super().do_GET()

if __name__ == "__main__":
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    threading.Thread(target=update_loop, daemon=True).start()
    with socketserver.ThreadingTCPServer(("", 7000), Handler) as httpd:
        print("NOC Dashboard active on http://localhost:7000")
        httpd.serve_forever()
