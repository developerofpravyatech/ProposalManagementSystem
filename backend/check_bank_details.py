import asyncio
import sys
sys.path.insert(0, '.')
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.connect() as conn:
        # Check company_bank_details columns
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_bank_details'
            ORDER BY ordinal_position
        """))
        print('company_bank_details columns:')
        for row in result:
            print(f'  {row[0]}: {row[1]}')
        
        # Check data
        result = await conn.execute(text('SELECT * FROM company_bank_details'))
        print()
        print('company_bank_details data:')
        for row in result:
            print(f'  {row}')

asyncio.run(check())