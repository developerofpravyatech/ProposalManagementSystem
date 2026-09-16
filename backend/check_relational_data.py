import asyncio
from sqlalchemy import text
from app.database import engine

async def check():
    async with engine.connect() as conn:
        # Check company_core_values
        result = await conn.execute(text("SELECT * FROM company_core_values"))
        rows = result.fetchall()
        print("company_core_values:")
        for row in rows:
            print(f"  {row}")
        
        result = await conn.execute(text("SELECT * FROM company_services"))
        rows = result.fetchall()
        print("\ncompany_services:")
        for row in rows:
            print(f"  {row}")
            
        result = await conn.execute(text("SELECT * FROM company_bni_clients"))
        rows = result.fetchall()
        print("\ncompany_bni_clients:")
        for row in rows:
            print(f"  {row}")
            
        result = await conn.execute(text("SELECT * FROM company_international_clients"))
        rows = result.fetchall()
        print("\ncompany_international_clients:")
        for row in rows:
            print(f"  {row}")
            
        result = await conn.execute(text("SELECT * FROM company_branch_offices"))
        rows = result.fetchall()
        print("\ncompany_branch_offices:")
        for row in rows:
            print(f"  {row}")
            
        result = await conn.execute(text("SELECT * FROM company_theme_config"))
        rows = result.fetchall()
        print("\ncompany_theme_config:")
        for row in rows:
            print(f"  {row}")

asyncio.run(check())