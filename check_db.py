import psycopg2
conn = psycopg2.connect('postgresql://postgres:3104@localhost:5432/proposal_management_system')
cur = conn.cursor()

# Check which columns exist
cols_to_check = ['work_process_steps', 'core_values', 'contract_terms', 'services', 'theme_config']
for col in cols_to_check:
    cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = '{col}'")
    result = cur.fetchone()
    print(f"Column '{col}': {'EXISTS' if result else 'MISSING'}")

# Check JSON column data (only for existing columns)
cur.execute("SELECT services, bni_clients, international_clients, branch_offices, contract_terms, theme_config FROM company_profile WHERE id = 1")
row = cur.fetchone()
print("\n=== JSON column values ===")
print(f"services: {row[0]}")
print(f"bni_clients: {row[1]}")
print(f"international_clients: {row[2]}")
print(f"branch_offices: {row[3]}")
print(f"contract_terms: {row[4]}")
print(f"theme_config: {row[5]}")

# Check relational data
cur.execute('SELECT id, title, description, sort_order FROM core_values WHERE company_profile_id = 1 ORDER BY sort_order')
print('\n=== core_values_rel ===')
for r in cur.fetchall():
    print(f'  id={r[0]}, title={r[1]}, description={r[2]}, sort_order={r[3]}')

cur.close()
conn.close()
