#!/usr/bin/env python3
import http.server, socketserver, os, threading, time
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get('PORT', 8083))
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(('', PORT), Handler)
print(f'Serving http://0.0.0.0:{PORT} from {os.getcwd()}')
threading.Thread(target=httpd.serve_forever, daemon=True).start()
try:
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    httpd.shutdown()
