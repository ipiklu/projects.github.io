import subprocess, time, json, http.server, socketserver, threading
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

CONFIG_FILE = "config/config_app.json"
TEMPLATE_FILE = "templates/template.html"
OUTPUT_FILE = "templates/index.html"

stats = {"up": 0, "down": 0}

def check_port(user, host, target):
    global stats
    t_name, t_ip, t_port = target['name'], target['ip'], target['port']
    cmd = ["ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", f"{user}@{host}", 
           f"timeout 0.5 bash -c '</dev/tcp/{t_ip}/{t_port}' && echo 'UP' || echo 'DOWN'"]
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
         data-status="{"UP" if is_up else "DOWN"}" 
         data-search="{t_name.lower()} {t_ip}">
        <div class="flex justify-between items-center px-1">
            <span class="text-[8px] font-bold text-white truncate target-name">{t_name}</span>
            <div class="h-2 w-2 rounded-full {dot_color} status-dot"></div>
        </div>
        <p class="text-[7px] text-slate-500 truncate px-1 target-ip">{t_ip}:{t_port}</p>
    </div>'''

def process_node(node):
    src = node['remote_source']
    h_ip, h_name, zone = src['host'], src['hostname'], src['zone']
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        hlr_html = "".join(list(executor.map(lambda t: check_port(src['user'], h_ip, t), node['HLR_targets'])))
        air_html = "".join(list(executor.map(lambda t: check_port(src['user'], h_ip, t), node['AIR_targets'])))

    return f'''
    <div class="source-card bg-slate-900/40 border border-slate-800 p-4 rounded shadow-2xl" data-zone="{zone}" data-node="{h_name.lower()}">
        <div class="flex justify-between border-b border-slate-800/50 mb-4 pb-2 items-center">
            <span class="text-yellow-500 font-bold node-header-text uppercase tracking-tighter text-[12px]">{h_name}</span>
            <span class="node-sub-text text-slate-600 font-bold uppercase tracking-widest text-[9px]">{zone} | {h_ip}</span>
        </div>
        <h3 class="section-title text-[9px] font-black text-slate-500 mb-2 uppercase tracking-widest text-center bg-white/5 py-1 rounded-sm">HLR Network</h3>
        <div class="grid grid-cols-3 gap-2 mb-4 target-grid">{hlr_html}</div>
        <h3 class="section-title text-[9px] font-black text-slate-500 mb-2 mt-4 uppercase tracking-widest text-center bg-white/5 py-1 rounded-sm">AIR Network</h3>
        <div class="grid grid-cols-3 gap-2 target-grid">{air_html}</div>
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
            with open(OUTPUT_FILE, "w") as f:
                f.write(template.format(
                    cards=all_cards, 
                    timestamp=datetime.now().strftime("%H:%M:%S"),
                    total_up=stats["up"],
                    total_down=stats["down"]
                ))
            time.sleep(5)
        except Exception as e: print(f"Error: {e}"); time.sleep(2)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory="templates", **kwargs)

if __name__ == "__main__":
    threading.Thread(target=update_loop, daemon=True).start()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", 8000), Handler) as httpd:
        print("Server at http://localhost:8000")
        httpd.serve_forever()
