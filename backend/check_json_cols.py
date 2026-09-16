import asyncio
from sqlalchemy import text
from app.database import engine

async def check():
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "SELECT id, company_name, core_values, services, bni_clients, "
            "international_clients, branch_offices, theme_config FROM company_profile LIMIT 1"
        ))
        row = result.fetchone()
        print('ID:', row[0])
        print('Name:', row[1])
        print('core_values (JSON):', repr(row[2])[:300])
        print('services (JSON):', repr(row[3])[:300])
        print('bni_clients (JSON):', repr(row[4])[:300])
        print('international_clients (JSON):', repr(row[5])[:300])
        print('branch_offices (JSON):', repr(row[6])[:300])
        print('theme_config (JSON):', repr(row[7])[:300])

asyncio.run(check())