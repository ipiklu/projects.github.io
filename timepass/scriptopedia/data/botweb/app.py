import os
import pty
import subprocess
import threading
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingTCPServer
import socket
import signal

# Configuration
PORT = 8020
HOST = ''
IP = socket.gethostbyname(socket.gethostname())
FILENAME = 'bot.sh'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BOT_SCRIPT_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', FILENAME))

output_buffer = ""
master_fd = None
current_pid = None

def run_bot_thread():
    global output_buffer, master_fd, current_pid
    output_buffer = ""  # <--- THIS IS KEY: It wipes the server's memory of the old run

    # 1. Kill the old process if it is still running
    if current_pid:
        try:
            os.kill(current_pid, signal.SIGTERM)
            os.waitpid(current_pid, os.WNOHANG) # Clean up zombie process
        except:
            pass

    output_buffer = "" # Clear previous logs for the new hit
    
    # 2. Create the terminal pair
    pid, fd = pty.fork()
    
    if pid == 0:  # Child process
        os.execvpe("bash", ["bash", "--noediting", "-c", f"set +H; source {BOT_SCRIPT_PATH}"], os.environ)
    else:  # Parent process
        current_pid = pid
        master_fd = fd
        while True:
            try:
                data = os.read(master_fd, 1024).decode('utf-8', errors='ignore')
                if not data:
                    break
                output_buffer += data
            except OSError:
                break

class FinalSmoothHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/img/'):
            # Path logic: script/botweb/img/filename.ext
            # We use unquote to handle spaces or special characters in filenames
            filename = urllib.parse.unquote(self.path[5:])
            img_path = os.path.join(BASE_DIR, 'img', filename)

            if os.path.exists(img_path) and os.path.isfile(img_path):
                self.send_response(200)

                # Automatically set the correct Mime-Type based on extension
                if img_path.lower().endswith(".png"):
                    self.send_header("Content-type", "image/png")
                elif img_path.lower().endswith(".gif"):
                    self.send_header("Content-type", "image/gif")
                elif img_path.lower().endswith((".jpg", ".jpeg")):
                    self.send_header("Content-type", "image/jpeg")
                else:
                    self.send_header("Content-type", "application/octet-stream")

                self.end_headers()
                with open(img_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "Image Not Found")
            return

        if self.path == '/css/style.css':
            # Logic to find script/botweb/css/style.css
            css_path = os.path.join(BASE_DIR, 'css', 'style.css')
            if os.path.exists(css_path):
                self.send_response(200)
                self.send_header("Content-type", "text/css")
                self.end_headers()
                with open(css_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "CSS File Not Found")
            return

        if self.path == '/js/script.js':
            js_path = os.path.join(BASE_DIR, 'js', 'script.js')
            if os.path.exists(js_path):
                self.send_response(200)
                self.send_header("Content-type", "application/javascript")
                self.end_headers()
                with open(js_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "JS File Not Found")
            return

        if self.path == '/status':
            self.send_response(200)
            self.send_header("Content-type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(output_buffer.encode("utf-8"))
            return

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        # UI (Same as before, but pointing to our new logic)
        html = f'''
        <!DOCTYPE html>
        <html>
        <head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
            <title>Terminal-BOT</title>
            <!---Alert--->
            <link rel="stylesheet" href="https://ipiklu.github.io/projects.github.io/alertify.js-0.3.11/themes/alertify.core.css" />
            <link rel="stylesheet" href="https://ipiklu.github.io/projects.github.io/alertify.js-0.3.11/themes/alertify.default.css" />
            <script src="https://ipiklu.github.io/projects.github.io/alertify.js-0.3.11/lib/alertify.min.js"></script>
            <script src="js/script.js" defer></script>
            <style>
                body {{ background: #000; color: #0f0; font-family: monospace; padding: 20px; }}
                #terminal {{ border: 1px solid #0f0; height: 500px; overflow-y: auto; padding: 10px; white-space: pre-wrap; }}
                input {{ background: #000; color: #0f0; border: 1px solid #0f0; width: 70% !important; box-sizing: border-box; padding: 10px; transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);}}
                input:hover {{ transform: scale(0.98); box-shadow: 3px 2px 22px 1px #AA205c; background: rgba(170, 32, 92, 0.5); color: #fff; animation: animated-border-glow 8s infinite linear; }}
                input:active {{ transform: scale(0.98); box-shadow: 3px 2px 22px 1px #AA205c; }}
                button {{ background: #0f0; color: #000; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; border-radius: 2.5rem;
                            outline: none;transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        }}
                    button:hover {{ transform: scale(1.2); border: 1px none rgba(o, 0, 0, 0.2); outline: none;
                                    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
                                                            0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
                                                            0 22.3px 17.9px rgba(0, 0, 0, 0.072),
                                                            0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
                                    animation: animated-border-glow 8s infinite linear;
                    }}
                    button:active {{ transform: scale(0.94) !important; outline: none; box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24); }}
                .ansi-green {{ color: #00ff00; }} .ansi-red {{ color: #ff3333; }}
                .imgS {{ border-radius: 10px; margin-left: 10px; max-width:40px; max-height: 90%;
                            float:left;transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                      }}
                    .imgS:hover {{ animation: animated-border-glow 8s infinite linear;  transition: 0.2s all; transform: scale(1.1); cursor: pointer;}}
                    .imgS:active {{ transform: scale(0.94) !important; outline: none; box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24); }}
                .index-alert {{ color: #AA205C; transition: color 0.3s ease; }}
                    .index-alert:hover {{
                            background-image: linear-gradient(
                                                        90deg,
                                                        #1a73e8, /* Blue */
                                                        #34a853, /* Green */
                                                        #000,   /* black */
                                                        #B6C511,
                                                        #1a73e8, /* Blue again for a smooth loop */
                                                        #34a853
                                                    );
                            background-size: 400% 100%;
                            -webkit-background-clip: text; /* Clips the background to the text shape */
                            background-clip: text;
                            color: transparent; /* Makes the text itself transparent to show the background */
                            animation: animated-text-color 4s infinite linear; /* New text color animation */
                    }}
                @keyframes animated-border-glow {{
                    0% {{ box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(100, 100, 255, 0.7); /* Blue */ }}
                    25% {{ box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(100, 255, 100, 0.7); /* Green */ }}
                    50% {{ box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 100, 100, 0.7); /* Red */ }}
                    75% {{ box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 255, 100, 0.7); /* Yellow */ }}
                    100% {{ box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(100, 100, 255, 0.7); /* Blue (back to start) */ }}
                }}
                @keyframes blink {{ 50% {{ opacity: 0;  color: transparent;}} }}
                .loader__dot {{ animation: 1s blink infinite }}
                .loader__dot:nth-child(2) {{ animation-delay: 250ms }}
                .loader__dot:nth-child(3) {{ animation-delay: 500ms }}
                @media (max-width: 768px) {{
                    body {{  padding: 10px; }}
                    #terminal {{ height: 60vh; font-size: 14px; padding: 5px; }}
                    input {{ width: 100% !important; box-sizing: border-box; margin-bottom: 15px; font-size: 16px; }}
                    button {{ width: 100%; border-radius: 10px; padding: 15px; }}
                    h2 {{ font-size: 1.2rem; }}
                    button:hover, input:hover {{
                        transform: scale(0.98); animation: animated-border-glow 8s infinite linear;
                    }}
	                button:hover, input:active {{
                        transform: scale(0.94);  !important; outline: none; box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
                    }}
                }}
            </style>
        </head>
        <body>
        <img class="imgS" src="img/LOADING.gif" onClick="return(view());" title="About Us"/>
            <h2><span onClick="reloadClear()" title="Reload" style="cursor:pointer;">Terminal BOT</span><span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span></h2>
            <div id="terminal">Initializing...</div>
            <div style="margin-top:10px;">
                <input type="text" id="cmd" autocomplete="off" onkeydown="if(event.key==='Enter') send()">
                <button onclick="send()">SEND</button>
            </div>
            <script>
                let isUserScrolling = false;
                const term = document.getElementById('terminal');

                term.addEventListener('scroll', () => {{
                    const distanceToBottom = term.scrollHeight - term.scrollTop - term.clientHeight;
                    isUserScrolling = distanceToBottom > 50;
                }});

                function ansiToHtml(text) {{
                    const colors = {{ '31': 'ansi-red', '32': 'ansi-green', '5;32': 'ansi-green' }};
                    return text.replace(/\\x1b\\[([0-9;]+)m(.*?)\\x1b\\[0m/g, (m, c, content) => {{
                        return `<span class="${{colors[c] || ''}}">${{content}}</span>`;
                    }}).replace(/\\x1b\\[[0-9;]*[mHJ]/g, '');
                }}

                function send() {{
                    const i = document.getElementById('cmd');
                    if(!i.value.trim()) return;
                    
                    fetch('/input', {{method:'POST', body: new URLSearchParams({{'cmd': i.value}})}});
                    i.value = '';
                    
                    isUserScrolling = false; 
                    setTimeout(() => {{ term.scrollTop = term.scrollHeight; }}, 100);
                }}

                setInterval(() => {{
                    if (window.getSelection().toString() !== "") return;

                    fetch('/status').then(r => r.text()).then(data => {{
                        const newHtml = ansiToHtml(data);
                        if (term.innerHTML !== newHtml) {{
                            term.innerHTML = newHtml;
                            if (!isUserScrolling) {{
                                term.scrollTop = term.scrollHeight;
                            }}
                        }}
                    }});
                }}, 500);

		window.onload = () => {{
			const term = document.getElementById('terminal');
				
			// 1. Visually reset the terminal immediately
			term.innerHTML = '<span style="color: cyan;">[SYSTEM]: Initializing fresh session...</span>';
				
			// 2. Tell Python to kill the old process and start a new one
			fetch('/run', {{method:'POST'}})
				.then(response => {{
					if(response.ok) {{
						console.log("Server confirmed: Bot Restarted");
					}}
				}});
			}}
        </script>
        </body>
        </html>
        '''
        self.wfile.write(html.encode("utf-8"))

    def do_POST(self):
        global master_fd
        if self.path == '/run':
            threading.Thread(target=run_bot_thread, daemon=True).start()
            self.send_response(200); self.end_headers()
        elif self.path == '/input':
            length = int(self.headers['Content-Length'])
            cmd = urllib.parse.parse_qs(self.rfile.read(length).decode())['cmd'][0]
            if master_fd:
                # Write directly to the master file descriptor of the pty
                os.write(master_fd, (cmd + "\n").encode())
            self.send_response(200); self.end_headers()

if __name__ == "__main__":
    ThreadingTCPServer.allow_reuse_address = True
    with ThreadingTCPServer((HOST, PORT), FinalSmoothHandler) as httpd:
        print(f"Server listening on http://{IP}:{PORT}")
        httpd.serve_forever()
