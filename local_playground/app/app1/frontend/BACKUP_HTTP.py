import http.server
import socketserver
import json

# Server configuration
PORT = 80

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    # Override the do_GET method to serve our custom webpage
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

    # Override the do_POST method to handle POST requests
    def do_POST(self):
        if self.path == '/log':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            event_data = json.loads(post_data.decode('utf-8'))
            self.log_event(event_data['event'])
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'message': 'Event logged successfully'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_event(self, event_message):
        # Save the event message to user_inputs.log
        with open('user_inputs.log', 'a') as log_file:
            log_file.write(event_message + '\n')
        print("Received event:", event_message)

# Create an HTTP server with the custom request handler
httpd = socketserver.TCPServer(('0.0.0.0', PORT), MyHTTPRequestHandler)

print(f"Server started at http://localhost:{PORT}")
httpd.serve_forever()
