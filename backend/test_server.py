import requests
import time
import subprocess
import sys
import os

# Kill any existing process on port 8000
os.system('taskkill /F /FI "PID eq 8288" 2>nul')

# Start server in background
proc = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'app.main:app', '--port', '8000'], 
                        stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

# Wait for startup
print("Waiting for server startup...")
time.sleep(8)

# Test API
print("Testing API...")
try:
    r = requests.get('http://127.0.0.1:8000/api/company-profile/', timeout=10)
    print('Status:', r.status_code)
    print('Response:', r.text)
except Exception as e:
    print('Error:', e)

# Kill server
proc.terminate()
print('Server output:')
try:
    stdout, _ = proc.communicate(timeout=5)
    print(stdout.decode())
except:
    pass