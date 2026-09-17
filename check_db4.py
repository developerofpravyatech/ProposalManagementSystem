import psycopg2
conn = psycopg2.connect('postgresql://postgres:3104@localhost:5432/proposal_management_system')
cur = conn.cursor()

cur.execute("SELECT id, title, description, logo, sort_order FROM core_values WHERE company_profile_id = 1 ORDER BY sort_order")
print("=== core_values table ===")
for r in cur.fetchall():
    logo_preview = r[3][:50] if r[3] else "None"
    print(f"  id={r[0]}, title={r[1]}, description={r[2][:30] if r[2] else 'None'}..., logo={logo_preview}")

cur.execute("SELECT id, title, logo FROM company_services WHERE company_profile_id = 1 ORDER BY sort_order")
print("\n=== company_services table ===")
for r in cur.fetchall():
    logo_preview = r[2][:50] if r[2] else "None"
    print(f"  id={r[0]}, title={r[1]}, logo={logo_preview}")

cur.execute("SELECT id, name, logo FROM company_bni_clients WHERE company_profile_id = 1 ORDER BY sort_order")
print("\n=== company_bni_clients table ===")
for r in cur.fetchall():
    logo_preview = r[2][:50] if r[2] else "None"
    print(f"  id={r[0]}, name={r[1]}, logo={logo_preview}")

conn.close()
