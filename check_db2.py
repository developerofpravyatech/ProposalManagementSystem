import psycopg2
conn = psycopg2.connect('postgresql://postgres:3104@localhost:5432/proposal_management_system')
cur = conn.cursor()

cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'work_process_steps'")
r = cur.fetchone()
print('work_process_steps column:', 'EXISTS' if r else 'MISSING')

cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'core_values'")
r = cur.fetchone()
print('core_values column:', 'EXISTS' if r else 'MISSING')

conn.close()
