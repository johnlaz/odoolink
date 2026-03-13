#!/usr/bin/env python3
"""Odoo Email Link - Local proxy server.
Run this once before opening the app: python server.py
Runs on http://localhost:7842
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import urlopen, Request
from urllib.parse import urlparse, parse_qs
import urllib.error

PORT = 7842

class ProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/ping":
            self.send_response(200)
            self._cors()
Content-Type
text/plain
            self.end_headers()
ok
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        params = parse_qs(urlparse(self.path).query)
url
        if not target:
            self.send_response(400)
            self.end_headers()
            return
Content-Length
        body = self.rfile.read(length)
        try:
Content-Type
text/xml
            with urlopen(req, timeout=15) as resp:
                data = resp.read()
            self.send_response(200)
            self._cors()
Content-Type
text/xml
            self.end_headers()
            self.wfile.write(data)
        except urllib.error.URLError as e:
            self.send_response(502)
            self._cors()
            self.end_headers()
            self.wfile.write(str(e).encode())

    def _cors(self):
Access-Control-Allow-Origin
*
Access-Control-Allow-Methods
POST, OPTIONS
Access-Control-Allow-Headers
Content-Type

    def log_message(self, fmt, *args):
        pass  # suppress all request logging

__main__
    server = HTTPServer(("localhost", PORT), ProxyHandler)
    print("Odoo Email Link - Local Proxy Server")
    print(f"Running on http://localhost:{PORT}")
    print("Keep this window open while using the app.")
    print("Press Ctrl+C to stop.\
")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\
Server stopped.")