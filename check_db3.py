import psycopg2
conn = psycopg2.connect('postgresql://postgres:3104@localhost:5432/proposal_management_system')
cur = conn.cursor()

# Get all column names for company_profile
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'company_profile' ORDER BY ordinal_position")
cols = [r[0] for r in cur.fetchall()]
print("All columns:", cols)

# Check specifically for work_process_steps
print("\n'work_process_steps' in columns:", 'work_process_steps' in cols)

# Try to select it
try:
    cur.execute("SELECT work_process_steps FROM company_profile LIMIT 1")
    row = cur.fetchone()
    print("work_process_steps value:", row[0] if row else "no rows")
except Exception as e:
    print(f"Error: {e}")

conn.close()
