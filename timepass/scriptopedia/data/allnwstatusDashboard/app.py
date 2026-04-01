import subprocess, time, json, http.server, socketserver, threading, os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from socketserver import ThreadingTCPServer
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config/config_app.json")
TEMPLATE_FILE = os.path.join(BASE_DIR, "templates/template.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "templates/index.html")

def check_port(user, host, target):
    t_name, t_ip, t_port = target['name'], target['ip'], target['port']
    # SSH Command for Port Check
    cmd = ["ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no",
           f"{user}@{host}", f"timeout 0.5 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'UP' || echo 'DOWN'"]
    try:
        res = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, universal_newlines=True)
        is_up = "UP" in res
    except: 
        is_up = False

    status_attr = "UP" if is_up else "DOWN"
    
    # URL for Remote Ping: Tells the handler which 'host' should perform the ping to 't_ip'
    ping_url = f"/ping?ip={t_ip}&from_host={host}&ssh_user={user}"

    return f'''
    <a href="{ping_url}" 
       onclick="window.open(this.href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=750,height=550'); return false;" 
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
    src = node.get('remote_source', {})
    h_ip, zone = src.get('host', '0.0.0.0'), src.get('zone', 'NA')
    h_name, user = src.get('hostname', h_ip), src.get('user', 'root')

    with ThreadPoolExecutor(max_workers=25) as executor:
        hlr_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('HLR_targets', []))))
        air_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('AIR_targets', []))))
        inum_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('INUM_targets', []))))

    def make_section(label, content):
        if not content: return ""
        return f'''
        <div class="category-section" data-category="{label}">
            <h3 class="network-heading">
                {label} NETWORK
                <span class="section-counter text-[14px] ml-2 opacity-60"></span>
            </h3>
            <div class="target-grid">{content}</div>
        </div>'''

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
    while True:
        try:
            if not os.path.exists(CONFIG_FILE):
                time.sleep(5)
                continue

            with open(CONFIG_FILE, 'r') as f: config = json.load(f)
            with ThreadPoolExecutor(max_workers=10) as executor:
                all_cards = "".join(list(executor.map(process_node, config)))

            with open(TEMPLATE_FILE, 'r') as f: template = f.read()
            output = template.replace("{cards}", all_cards).replace("{timestamp}", datetime.now().strftime("%H:%M:%S"))

            with open(OUTPUT_FILE, "w") as f: 
                f.write(output)
            
            time.sleep(5)
        except Exception as e:
            print(f"Update Loop Error: {e}")
            time.sleep(2)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(BASE_DIR, "templates"), **kwargs)

    def do_GET(self):
        # CUSTOM ROUTE: Executes Ping on the REMOTE host via SSH
        if self.path.startswith('/ping'):
            query = parse_qs(urlparse(self.path).query)
            target_ip = query.get('ip', [None])[0]
            from_host = query.get('from_host', [None])[0]
            ssh_user = query.get('ssh_user', [None])[0]

            if not all([target_ip, from_host, ssh_user]):
                self.send_error(400, "Missing parameters")
                return

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            # Terminal Style UI for the popup
            self.wfile.write(b"<html><head><title>Remote SSH Ping</title></head>")
            self.wfile.write(b"<body style='background:#05070a;color:#10b981;font-family:monospace;padding:20px;'><pre>")
            self.wfile.write(f"--- INITIATING REMOTE PING VIA SSH ---\n".encode())
            self.wfile.write(f"FROM SOURCE : {from_host}\n".encode())
            self.wfile.write(f"TO TARGET   : {target_ip}\n".encode())
            self.wfile.write(f"--------------------------------------\n\n".encode())
            self.wfile.flush()

            # SSH to the source node and execute the ping command there
            cmd = ["ssh", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no", 
                   f"{ssh_user}@{from_host}", f"ping -c 10 {target_ip}"]
            
            try:
                with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as proc:
                    for line in proc.stdout:
                        self.wfile.write(line.encode())
                        self.wfile.flush()
            except Exception as e:
                self.wfile.write(f"SSH Execution Error: {e}\n".encode())

            self.wfile.write(b"\n\n--- REMOTE TEST COMPLETE ---</pre></body></html>")
            return

        super().do_GET()

    def address_string(self):
        return self.client_address[0]

    def log_message(self, format, *args):
        return

if __name__ == "__main__":
    # Start the background data fetcher
    threading.Thread(target=update_loop, daemon=True).start()

    # ThreadingTCPServer allows multiple pings/page loads simultaneously
    ThreadingTCPServer.allow_reuse_address = True
    with ThreadingTCPServer(("", 8000), Handler) as httpd:
        print("------------------------------------------")
        print("NOC DASHBOARD LOADED SUCCESSFULLY")
        print("Local Access:   http://localhost:8000")
        print("------------------------------------------")
        httpd.serve_forever()
