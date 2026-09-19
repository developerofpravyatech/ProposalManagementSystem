import asyncio
import sys
sys.path.insert(0, '.')
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.connect() as conn:
        # Check company_profile columns
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_profile'
            ORDER BY ordinal_position
        """))
        print('company_profile columns:')
        for row in result:
            print(f'  {row[0]}: {row[1]}')
        
        print()
        # Check company_payment_methods columns
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_payment_methods'
            ORDER BY ordinal_position
        """))
        print('company_payment_methods columns:')
        for row in result:
            print(f'  {row[0]}: {row[1]}')

asyncio.run(check())