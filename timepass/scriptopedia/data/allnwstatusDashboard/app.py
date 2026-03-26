import subprocess
import time
import json
import socket
import http.server
import socketserver
import threading
from datetime import datetime

CONFIG_FILE = "config/config_app.json"
TEMPLATE_FILE = "templates/template.html"
OUTPUT_FILE = "templates/index.html"

def remote_check(user, host, target_ip, target_port):
    bash_cmd = f"timeout 0.5 bash -c '</dev/tcp/{target_ip}/{target_port}' && echo 'UP' || echo 'DOWN'"
    ssh_dest = f"{user}@{host}"
    cmd = ["ssh", "-o", "ConnectTimeout=1", "-o", "BatchMode=yes", ssh_dest, bash_cmd]
    try:
        result = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, universal_newlines=True)
        return "UP" in result
    except:
        return False

def update_loop():
    while True:
        try:
            with open(CONFIG_FILE, 'r') as f:
                config_list = json.load(f)
            
            all_content_html = ""
            for section in config_list:
                u, h = section['remote_source']['user'], section['remote_source']['host']
                
                # Start Source Container (takes 1/2 of the main row)
                all_content_html += f"""
                <div class="bg-slate-900/50 p-2 border border-slate-800 rounded">
                    <div class="border-b border-slate-700 mb-2 pb-1">
                        <span class="text-yellow-500 font-black text-[9px] uppercase tracking-tighter italic">SRC: {u}@{h}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-1">
                """

                for target in section['targets']:
                    is_up = remote_check(u, h, target['ip'], target['port'])
                    color = "emerald" if is_up else "rose"
                    bg = "bg-emerald-950/20 border-emerald-500/20" if is_up else "bg-rose-950/20 border-rose-500/20"
                    
                    all_content_html += f"""
                    <div class="p-1 rounded border {bg} h-10 flex flex-col justify-center">
                        <div class="flex justify-between items-center px-0.5">
                            <h2 class="text-[9px] font-bold text-white truncate">{target['name']}</h2>
                            <div class="h-1.5 w-1.5 rounded-full bg-{color}-500 {'animate-pulse shadow-[0_0_4px_#10b981]' if is_up else ''}"></div>
                        </div>
                        <p class="text-slate-500 text-[7px] leading-none mt-0.5 px-0.5">{target['ip']}</p>
                    </div>
                    """
                
                # Close the Source Container
                all_content_html += "</div></div>"

            with open(TEMPLATE_FILE, 'r') as f:
                template = f.read()
            
            final_render = template.format(
                cards=all_content_html,
                timestamp=datetime.now().strftime("%H:%M:%S"),
                hostname=socket.gethostname()
            )

            with open(OUTPUT_FILE, "w") as f:
                f.write(final_render)
            
            time.sleep(5)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="templates", **kwargs)

threading.Thread(target=update_loop, daemon=True).start()
PORT = 8000
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"🚀 Nano-Monitor Live: http://localhost:{PORT}")
    httpd.serve_forever()
