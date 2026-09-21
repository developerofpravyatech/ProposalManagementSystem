import asyncio
from sqlalchemy import create_engine, text

e = create_engine('postgresql+psycopg2://postgres:3104@localhost:5432/proposal_management_system')
with e.connect() as conn:
    result = conn.execute(text("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema='public' ORDER BY table_name
    """))
    tables = [r[0] for r in result]
    print("Tables:")
    for t in tables:
        print(f"  {t}")

    # Check company_profile columns
    print("\ncompany_profile columns:")
    result = conn.execute(text("""
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='company_profile' ORDER BY ordinal_position
    """))
    for r in result:
        print(f"  {r[0]}")

    # Check company_bni_clients data
    print("\ncompany_bni_clients data:")
    result = conn.execute(text("SELECT * FROM company_bni_clients"))
    rows = result.fetchall()
    for r in rows:
        print(f"  {r}")
    if not rows:
        print("  (empty)")

    # Check company_regional_clients data
    print("\ncompany_regional_clients data:")
    result = conn.execute(text("SELECT * FROM company_regional_clients"))
    rows = result.fetchall()
    for r in rows:
        print(f"  {r}")
    if not rows:
        print("  (empty)")

    # Check company_international_clients data
    print("\ncompany_international_clients data:")
    result = conn.execute(text("SELECT * FROM company_international_clients"))
    rows = result.fetchall()
    for r in rows:
        print(f"  {r}")
    if not rows:
        print("  (empty)")

    # Check company_profile JSON columns
    print("\ncompany_profile row:")
    result = conn.execute(text("SELECT id, company_name FROM company_profile LIMIT 1"))
    row = result.fetchone()
    print(f"  {row}")
