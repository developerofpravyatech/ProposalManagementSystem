import asyncio
import sys
sys.path.insert(0, '.')
from app.database import async_session_maker
from sqlalchemy import select
from app.models.company_profile_normalized import BankDetails, PaymentMethod

async def update_bank_data():
    async with async_session_maker() as db:
        # Update BankDetails
        result = await db.execute(select(BankDetails).where(BankDetails.company_profile_id == 1))
        bd = result.scalar_one_or_none()
        
        if bd:
            bd.bank_name = "STATE BANK OF INDIA"
            bd.account_name = "PRAVYA TECH Solutions"
            bd.account_number = "40410281486"
            bd.ifsc = "SBIN0001851"
            bd.branch = "Bhanktinagar Station Main Road"
            bd.upi_id = "PRAVYA2618@OKSBI"
            bd.swift_code = None
            bd.iban = None
            bd.qr_code = None
            print("Updated existing BankDetails")
        else:
            db.add(BankDetails(
                company_profile_id=1,
                bank_name="STATE BANK OF INDIA",
                account_name="PRAVYA TECH Solutions",
                account_number="40410281486",
                ifsc="SBIN0001851",
                branch="Bhanktinagar Station Main Road",
                upi_id="PRAVYA2618@OKSBI",
                swift_code=None,
                iban=None,
                qr_code=None,
            ))
            print("Created new BankDetails")
        
        # Also update PaymentMethod to keep in sync
        result = await db.execute(select(PaymentMethod).where(PaymentMethod.company_profile_id == 1))
        pm = result.scalar_one_or_none()
        if pm:
            pm.bank_name = "STATE BANK OF INDIA"
            pm.account_name = "PRAVYA TECH Solutions"
            pm.account_number = "40410281486"
            pm.ifsc = "SBIN0001851"
            pm.branch = "Bhanktinagar Station Main Road"
            pm.upi_id = "PRAVYA2618@OKSBI"
            pm.swift_code = None
            pm.iban = None
            pm.qr_code = None
        
        await db.commit()
        print("Done!")

asyncio.run(update_bank_data())