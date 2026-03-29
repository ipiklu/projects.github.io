import subprocess, time, json, http.server, socketserver, threading, os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config/config_app.json")
TEMPLATE_FILE = os.path.join(BASE_DIR, "templates/template.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "templates/index.html")

stats = {"up": 0, "down": 0}

def check_port(user, host, target):
    global stats
    t_name, t_ip, t_port = target['name'], target['ip'], target['port']
    cmd = ["ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=no", 
           f"{user}@{host}", f"timeout 0.5 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'UP' || echo 'DOWN'"]
    try:
        res = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, universal_newlines=True)
        is_up = "UP" in res
    except: is_up = False
    
    if is_up: stats["up"] += 1 
    else: stats["down"] += 1

    status_class = "border-emerald-500/20 bg-emerald-900/10" if is_up else "border-rose-500/20 bg-rose-900/10"
    dot_color = "bg-emerald-500 shadow-[0_0_8px_#10b981]" if is_up else "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
    
    return f'''
    <div class="p-1 rounded border {status_class} h-10 flex flex-col justify-center target-box" 
         data-status="{"UP" if is_up else "DOWN"}" data-search="{t_name.lower()} {t_ip}">
        <div class="flex justify-between items-center px-1">
            <span class="text-[8px] font-bold text-white truncate">{t_name}</span>
            <div class="h-2 w-2 rounded-full {dot_color}"></div>
        </div>
        <p class="text-[7px] text-slate-500 truncate px-1">{t_ip}:{t_port}</p>
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
        return f'''
        <div class="category-section mb-6" data-category="{label}">
            <h3 class="text-[9px] font-black text-white mb-3 uppercase tracking-[0.4em] text-center bg-white/10 py-1.5 rounded-sm shadow-sm border-x border-white/5">{label} Network</h3>
            <div class="grid grid-cols-3 gap-2 target-grid">{content}</div>
        </div>'''

    return f'''
    <div class="source-card bg-slate-900/40 border border-slate-800 p-4 rounded shadow-2xl" data-zone="{zone}" data-node="{h_name.lower()}">
        <div class="flex justify-between border-b border-slate-800/50 mb-6 pb-2 items-center">
            <span class="text-yellow-500 font-bold uppercase tracking-tighter text-[12px]">{h_name}</span>
            <span class="text-slate-600 font-bold uppercase tracking-widest text-[9px]">{zone} | {h_ip}</span>
        </div>
        {make_section("HLR", hlr_html)}
        {make_section("AIR", air_html)}
        {make_section("INUM", inum_html)}
    </div>'''

def update_loop():
    global stats
    while True:
        try:
            stats = {"up": 0, "down": 0}
            with open(CONFIG_FILE, 'r') as f: config = json.load(f)
            with ThreadPoolExecutor(max_workers=8) as executor:
                all_cards = "".join(list(executor.map(process_node, config)))
            with open(TEMPLATE_FILE, 'r') as f: template = f.read()
            output = template.replace("{cards}", all_cards).replace("{timestamp}", datetime.now().strftime("%H:%M:%S")).replace("{total_up}", str(stats["up"])).replace("{total_down}", str(stats["down"]))
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
        print("Server running at http://localhost:8000")
        httpd.serve_forever()
