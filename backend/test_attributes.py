import asyncio
import sys
sys.path.insert(0, 'C:\\Users\\PravyaTech Pvt Ltd\\Desktop\\proposal_managment\\backend')

from sqlalchemy import text
from app.database import async_session_maker, engine, Base
from app.models.company_profile import CompanyProfile
from app.services.company_profile_service import get_or_create_company_profile, update_company_profile
from app.models.company_profile_normalized import BNIClient, RegionalClient, InternationalClient

async def test():
    # First, check what attributes the CompanyProfile model has
    print("CompanyProfile mapped attributes:")
    for attr in CompanyProfile.__table__.columns:
        print(f"  {attr.name}")
    
    print("\nCompanyProfile relationships:")
    for name in dir(CompanyProfile):
        if 'rel' in name.lower() or 'bni' in name.lower() or 'regional' in name.lower() or 'international' in name.lower():
            print(f"  {name}")
    
    # Check if bni_clients is an attribute (not relationship)
    print(f"\nhasattr CompanyProfile 'bni_clients': {hasattr(CompanyProfile, 'bni_clients')}")
    print(f"hasattr CompanyProfile 'bni_clients_rel': {hasattr(CompanyProfile, 'bni_clients_rel')}")
    print(f"hasattr CompanyProfile 'regional_clients': {hasattr(CompanyProfile, 'regional_clients')}")
    print(f"hasattr CompanyProfile 'regional_clients_rel': {hasattr(CompanyProfile, 'regional_clients_rel')}")
    print(f"hasattr CompanyProfile 'international_clients': {hasattr(CompanyProfile, 'international_clients')}")
    print(f"hasattr CompanyProfile 'international_clients_rel': {hasattr(CompanyProfile, 'international_clients_rel')}")
    
    # Check if bni_clients column exists in the table
    print(f"\nbni_clients in table columns: {'bni_clients' in [c.name for c in CompanyProfile.__table__.columns]}")
    print(f"regional_clients in table columns: {'regional_clients' in [c.name for c in CompanyProfile.__table__.columns]}")
    print(f"international_clients in table columns: {'international_clients' in [c.name for c in CompanyProfile.__table__.columns]}")

asyncio.run(test())
