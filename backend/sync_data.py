import asyncio
from app.database import async_session_maker
from app.services.company_profile_service import get_or_create_company_profile

async def sync_data():
    async with async_session_maker() as db:
        profile = await get_or_create_company_profile(db)
        print(f"Profile: {profile.company_name}")
        print(f"Core values rel: {len(profile.core_values_rel)}")
        print(f"Services rel: {len(profile.services_rel)}")
        print(f"BNI clients rel: {len(profile.bni_clients_rel)}")
        print(f"International clients rel: {len(profile.international_clients_rel)}")
        print(f"Branch offices rel: {len(profile.branch_offices_rel)}")
        print(f"Theme config rel: {profile.theme_config_rel}")

asyncio.run(sync_data())