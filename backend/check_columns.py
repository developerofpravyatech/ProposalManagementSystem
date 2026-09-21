import asyncio
from sqlalchemy import create_engine, text

e = create_engine('postgresql+psycopg2://postgres:3104@localhost:5432/proposal_management_system')
with e.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns 
        WHERE table_name='company_profile' 
        AND column_name IN ('bni_clients', 'international_clients', 'branch_offices', 'regional_clients', 'services', 'core_values')
        ORDER BY column_name
    """))
    for r in result:
        print(f"  {r[0]}: {r[1]} (max_len: {r[2]})")

    print("\nbni_clients JSON data:")
    result = conn.execute(text("SELECT bni_clients FROM company_profile WHERE id = 1"))
    row = result.fetchone()
    if row:
        print(f"  {row[0]}")

    print("\ninternational_clients JSON data:")
    result = conn.execute(text("SELECT international_clients FROM company_profile WHERE id = 1"))
    row = result.fetchone()
    if row:
        print(f"  {row[0]}")

    print("\nbranch_offices JSON data:")
    result = conn.execute(text("SELECT branch_offices FROM company_profile WHERE id = 1"))
    row = result.fetchone()
    if row:
        print(f"  {row[0]}")

    print("\ntheme_config data:")
    result = conn.execute(text("SELECT theme_config FROM company_profile WHERE id = 1"))
    row = result.fetchone()
    if row:
        print(f"  {row[0]}")
