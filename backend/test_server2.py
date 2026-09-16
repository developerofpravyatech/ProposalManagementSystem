import requests
import time
import subprocess
import sys
import os
import threading

# Start server in background and capture output
output_lines = []

def read_output(proc):
    for line in iter(proc.stdout.readline, ''):
        output_lines.append(line)
        print(line, end='')

os.system('taskkill /F /FI "PID eq 8288" 2>nul')

proc = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'app.main:app', '--port', '8000'], 
                        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

# Start output reader thread
reader = threading.Thread(target=read_output, args=(proc,), daemon=True)
reader.start()

# Wait for startup
print("Waiting for server startup...")
time.sleep(10)

# Test API
print("Testing API...")
try:
    r = requests.get('http://127.0.0.1:8000/api/company-profile/', timeout=10)
    print('Status:', r.status_code)
    print('Response:', r.text[:500])
except Exception as e:
    print('Error:', e)

# Give time for error logs to appear
time.sleep(2)

# Kill server
proc.terminate()
proc.wait(timeout=5)