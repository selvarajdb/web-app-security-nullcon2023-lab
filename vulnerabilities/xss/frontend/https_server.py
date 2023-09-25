import http.server
import socketserver
import json
import logging

# Server configuration
PORT = 5555

# Configure logging
logging.basicConfig(filename='server.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                event_data = json.loads(post_data.decode('utf-8'))
                self.log_event(event_data['event'])
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'message': 'Event logged successfully'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                logging.error(f'Error handling POST request: {str(e)}')
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Internal server error'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_event(self, event_message):
        try:
            # Save the event message to user_inputs.log
            with open('user_inputs.log', 'a') as log_file:
                log_file.write(event_message + '\n')
            logging.info(f"Received event: {event_message}")
        except Exception as e:
            logging.error(f'Error logging event: {str(e)}')

# Create an HTTP server with the custom request handler
print(f"Starting server at http://localhost:{PORT}")
httpd = socketserver.TCPServer(('0.0.0.0', PORT), MyHTTPRequestHandler)

print(f"Server started at http://localhost:{PORT}")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
except Exception as e:
    logging.error(f'Server error: {str(e)}')

# Clean up resources on server shutdown
httpd.server_close()
