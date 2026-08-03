import os
import sys

# Add app to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import SessionLocal, Base, engine
from app.models import User, Item, RoleEnum, ItemTypeEnum, ItemStatusEnum
from app.utils.auth import get_password_hash
from app.services.matching import process_item_matching

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if items already seeded
        if db.query(Item).first():
            print("Database already contains items. Skipping seed.")
            return

        # Users
        u1 = User(
            name="Alice Smith",
            email="alice@student.edu",
            password_hash=get_password_hash("Password123!"),
            role=RoleEnum.USER
        )
        u2 = User(
            name="Bob Jones",
            email="bob@student.edu",
            password_hash=get_password_hash("Password123!"),
            role=RoleEnum.USER
        )
        db.add_all([u1, u2])
        db.commit()
        db.refresh(u1)
        db.refresh(u2)

        # Lost Items
        lost_items = [
            Item(
                user_id=u1.id,
                type=ItemTypeEnum.LOST,
                name="Black Leather Bifold Wallet",
                category="Wallets & Purses",
                description="Black genuine leather wallet with student ID card and driver's license inside.",
                date_event="2026-08-01",
                location="Main Campus Library 2nd Floor",
                status=ItemStatusEnum.ACTIVE
            ),
            Item(
                user_id=u1.id,
                type=ItemTypeEnum.LOST,
                name="Space Gray MacBook Pro 14",
                category="Electronics",
                description="Apple MacBook Pro laptop with a dark blue protective sleeve and developer stickers.",
                date_event="2026-08-02",
                location="Engineering Student Lounge",
                status=ItemStatusEnum.ACTIVE
            ),
            Item(
                user_id=u2.id,
                type=ItemTypeEnum.LOST,
                name="Sony Noise-Canceling Headphones",
                category="Electronics",
                description="Matte black Sony WH-1000XM4 wireless headphones in original black zippered case.",
                date_event="2026-08-02",
                location="Student Union Cafeteria",
                status=ItemStatusEnum.ACTIVE
            )
        ]

        for item in lost_items:
            db.add(item)
        db.commit()

        # Found Items
        found_items = [
            Item(
                user_id=u2.id,
                type=ItemTypeEnum.FOUND,
                name="Dark Leather Pocket Wallet",
                category="Wallets & Purses",
                description="Found a black leather wallet containing a university student card under a study desk.",
                date_event="2026-08-01",
                location="University Library Quiet Zone",
                status=ItemStatusEnum.ACTIVE
            ),
            Item(
                user_id=u2.id,
                type=ItemTypeEnum.FOUND,
                name="Apple Laptop in Blue Sleeve",
                category="Electronics",
                description="Gray Apple notebook computer inside a navy blue padded case left near sofa.",
                date_event="2026-08-02",
                location="Engineering Building Lounge",
                status=ItemStatusEnum.ACTIVE
            )
        ]

        for item in found_items:
            db.add(item)
            db.commit()
            db.refresh(item)
            # Run automatic AI matching for each found item
            process_item_matching(item, db)

        print("Successfully seeded demo users, items, and calculated AI matches!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
