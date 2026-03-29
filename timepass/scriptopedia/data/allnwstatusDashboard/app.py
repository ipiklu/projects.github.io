import subprocess, time, json, http.server, socketserver, threading, os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config/config_app.json")
TEMPLATE_FILE = os.path.join(BASE_DIR, "templates/template.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "templates/index.html")

def check_port(user, host, target):
    t_name, t_ip, t_port = target['name'], target['ip'], target['port']
    cmd = ["ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no", 
           f"{user}@{host}", f"timeout 0.5 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'UP' || echo 'DOWN'"]
    try:
        res = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, universal_newlines=True)
        is_up = "UP" in res
    except: is_up = False
    
    status_attr = "UP" if is_up else "DOWN"
    
    return f'''
    <div class="target-box" data-status="{status_attr}" data-search="{t_name.lower()} {t_ip}">
        <div class="target-inner">
            <div class="target-header">
                <span class="target-label">{t_name}</span>
                <div class="status-indicator"></div>
            </div>
            <p class="target-subtext">{t_ip}:{t_port}</p>
        </div>
    </div>'''

def process_node(node):
    src = node.get('remote_source', {})
    h_ip, zone = src.get('host', '0.0.0.0'), src.get('zone', 'NA')
    h_name, user = src.get('hostname', h_ip), src.get('user', 'root')
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        hlr_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('HLR_targets', []))))
        air_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('AIR_targets', []))))
        inum_html = "".join(list(executor.map(lambda t: check_port(user, h_ip, t), node.get('INUM_targets', []))))

    def make_section(label, content):
        if not content: return ""
        # Added section-counter span
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
            with open(CONFIG_FILE, 'r') as f: config = json.load(f)
            with ThreadPoolExecutor(max_workers=10) as executor:
                all_cards = "".join(list(executor.map(process_node, config)))
            with open(TEMPLATE_FILE, 'r') as f: template = f.read()
            output = template.replace("{cards}", all_cards).replace("{timestamp}", datetime.now().strftime("%H:%M:%S"))
            with open(OUTPUT_FILE, "w") as f: f.write(output)
            time.sleep(5)
        except Exception as e: print(f"Update Error: {e}"); time.sleep(2)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(BASE_DIR, "templates"), **kwargs)
    def log_message(self, format, *args): return

if __name__ == "__main__":
    threading.Thread(target=update_loop, daemon=True).start()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", 8000), Handler) as httpd:
        print("Server at http://localhost:8000")
        httpd.serve_forever()
