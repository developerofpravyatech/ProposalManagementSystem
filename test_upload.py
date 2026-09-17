import requests
import io

BASE = "http://localhost:8000/api"

# Login
resp = requests.post(f"{BASE}/auth/login", json={"email": "admin@pravyatech.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Upload a test image (small 1x1 PNG)
png_bytes = io.BytesIO(bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63000100000005000100" + "0d0a2db4" + "0000000049454e44ae426082"))

resp = requests.post(f"{BASE}/company-profile/upload-logo", files={"file": ("test.png", png_bytes, "image/png")}, headers=headers)
print(f"Upload logo: {resp.status_code}")
upload_result = resp.json()
print(f"  stored_in_db: {upload_result.get('stored_in_db')}")
print(f"  url starts with: {upload_result.get('url', '')[:30]}...")
print(f"  url is base64 data URL: {upload_result.get('url', '').startswith('data:image')}")

# Check if the logo_data was saved in the database
resp = requests.get(f"{BASE}/company-profile/full", headers=headers)
profile = resp.json()
print(f"\nProfile after upload:")
print(f"  logo_data present: {bool(profile.get('logo_data'))}")
print(f"  logo_data starts with: {profile.get('logo_data', '')[:30]}...")
print(f"  logo_url: {profile.get('logo_url')}")

# Now test saving an item with a logo (e.g., core value with base64 logo)
logo_url = upload_result.get('url', '')
update_data = {
    "core_values": [
        {"title": "Test Value", "description": "Test Description", "logo": logo_url}
    ],
    "services": [
        {"title": "Test Service", "description": "Test service description", "logo": logo_url}
    ],
    "bni_clients": [
        {"name": "Test Client", "logo": logo_url}
    ]
}
resp = requests.put(f"{BASE}/company-profile/", json=update_data, headers=headers)
print(f"\nPUT with image data: {resp.status_code}")

# Verify images saved to relational tables
resp = requests.get(f"{BASE}/company-profile/full", headers=headers)
profile = resp.json()
print(f"\nData in relational tables:")
if profile.get('core_values_rel'):
    cv = profile['core_values_rel'][0]
    print(f"  CoreValue: title={cv['title']}, logo starts with: {cv['logo'][:30]}...")
if profile.get('services_rel'):
    svc = profile['services_rel'][0]
    print(f"  Service: title={svc['title']}, logo starts with: {svc['logo'][:30]}...")
if profile.get('bni_clients_rel'):
    bc = profile['bni_clients_rel'][0]
    print(f"  BNIClient: name={bc['name']}, logo starts with: {bc['logo'][:30]}...")
