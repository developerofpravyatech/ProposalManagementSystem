import asyncio
import sys
import time
import threading
import uvicorn
from app.main import app

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

# Start server in background thread
server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

# Wait for server to start
time.sleep(3)

# Test the API
import requests

print("Testing backend API...")

try:
    # Test health endpoint
    r = requests.get("http://127.0.0.1:8000/health", timeout=5)
    print(f"Health check: {r.status_code} - {r.json()}")
except Exception as e:
    print(f"Health check failed: {e}")

try:
    # Test company profile GET
    r = requests.get("http://127.0.0.1:8000/api/company-profile/", timeout=5)
    print(f"Company profile GET: {r.status_code}")
    data = r.json()
    print(f"  Company name: {data.get('company_name')}")
    print(f"  Core values (JSON): {len(data.get('core_values', []))} items")
    print(f"  Core values (rel): {len(data.get('core_values_rel', []))} items")
    print(f"  Services (rel): {len(data.get('services_rel', []))} items")
    print(f"  BNI clients (rel): {len(data.get('bni_clients_rel', []))} items")
    print(f"  International clients (rel): {len(data.get('international_clients_rel', []))} items")
    print(f"  Branch offices (rel): {len(data.get('branch_offices_rel', []))} items")
    print(f"  Theme config (rel): {data.get('theme_config_rel')}")
except Exception as e:
    print(f"Company profile GET failed: {e}")

try:
    # Test company profile full GET
    r = requests.get("http://127.0.0.1:8000/api/company-profile/full", timeout=5)
    print(f"Company profile FULL GET: {r.status_code}")
    data = r.json()
    print(f"  Core values (rel): {len(data.get('core_values_rel', []))} items")
    if data.get('core_values_rel'):
        print(f"  First core value: {data['core_values_rel'][0]}")
except Exception as e:
    print(f"Company profile FULL GET failed: {e}")

try:
    # Test public company profile
    r = requests.get("http://127.0.0.1:8000/api/public/proposals/company-profile/full", timeout=5)
    print(f"Public company profile FULL GET: {r.status_code}")
    data = r.json()
    print(f"  Core values (rel): {len(data.get('core_values_rel', []))} items")
except Exception as e:
    print(f"Public company profile FULL GET failed: {e}")

print("\nAll tests completed!")