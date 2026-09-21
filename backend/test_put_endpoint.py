import requests
import json

# First login to get token
print("=== Login ===")
login_data = {"email": "admin@pravyatech.com", "password": "admin123"}
r = requests.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
print(f"Login status: {r.status_code}")
if r.status_code == 200:
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print(f"Got token: {token[:30]}...")
    
    # Test GET company profile
    print("\n=== GET company profile ===")
    r = requests.get("http://127.0.0.1:8000/api/company-profile/full", headers=headers)
    print(f"GET status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"BNI clients (rel): {len(data.get('bni_clients_rel', []))}")
        for c in data.get('bni_clients_rel', []):
            print(f"  {c}")
        print(f"Regional clients (rel): {len(data.get('regional_clients_rel', []))}")
        for c in data.get('regional_clients_rel', []):
            print(f"  {c}")
        print(f"International clients (rel): {len(data.get('international_clients_rel', []))}")
        for c in data.get('international_clients_rel', []):
            print(f"  {c}")
    
    # Test PUT update BNI clients
    print("\n=== PUT update company profile ===")
    update_data = {
        "bni_clients": [
            {"name": "Test BNI Client 1", "logo": ""},
            {"name": "Test BNI Client 2", "logo": ""}
        ],
        "regional_clients": [
            {"name": "Test Regional Client", "logo": ""}
        ],
        "international_clients": [
            {"name": "Test International Client", "logo": ""}
        ]
    }
    r = requests.put("http://127.0.0.1:8000/api/company-profile/", json=update_data, headers=headers)
    print(f"PUT status: {r.status_code}")
    if r.status_code == 200:
        print("PUT success!")
    else:
        print(f"PUT error: {r.text}")
    
    # Check normalized tables after PUT
    print("\n=== Check normalized tables via DB ===")
    from sqlalchemy import create_engine, text
    e = create_engine('postgresql+psycopg2://postgres:3104@localhost:5432/proposal_management_system')
    with e.connect() as conn:
        print("company_bni_clients:")
        result = conn.execute(text("SELECT * FROM company_bni_clients"))
        for row in result.fetchall():
            print(f"  {row}")
        
        print("\ncompany_regional_clients:")
        result = conn.execute(text("SELECT * FROM company_regional_clients"))
        for row in result.fetchall():
            print(f"  {row}")
        
        print("\ncompany_international_clients:")
        result = conn.execute(text("SELECT * FROM company_international_clients"))
        for row in result.fetchall():
            print(f"  {row}")
        
        print("\ncompany_profile JSON columns:")
        result = conn.execute(text("SELECT bni_clients, international_clients FROM company_profile WHERE id = 1"))
        row = result.fetchone()
        if row:
            print(f"  bni_clients: {row[0]}")
            print(f"  international_clients: {row[1]}")
else:
    print(f"Login failed: {r.text}")
