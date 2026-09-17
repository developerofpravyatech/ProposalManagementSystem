import asyncio
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.connect() as conn:
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_profile' 
            AND (column_name LIKE '%cover%' OR column_name LIKE '%profile%')
            ORDER BY column_name
        """))
        for row in result:
            print(row)

asyncio.run(check())