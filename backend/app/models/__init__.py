import enum
import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class RoleEnum(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class ItemTypeEnum(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"

class ItemStatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    MATCHED = "MATCHED"
    COLLECTED = "COLLECTED"
    RESOLVED = "RESOLVED"

class MatchStatusEnum(str, enum.Enum):
    POTENTIAL = "POTENTIAL"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    RESOLVED = "RESOLVED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.USER, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("Item", back_populates="owner")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(ItemTypeEnum), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    date_event = Column(String(50), nullable=False) # e.g. "2026-08-03"
    location = Column(String(150), nullable=False)
    image_path = Column(String(255), nullable=True)
    status = Column(SQLEnum(ItemStatusEnum), default=ItemStatusEnum.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="items")
    lost_matches = relationship("Match", foreign_keys="[Match.lost_item_id]", back_populates="lost_item")
    found_matches = relationship("Match", foreign_keys="[Match.found_item_id]", back_populates="found_item")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    text_similarity = Column(Float, default=0.0)
    image_similarity = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    confidence_level = Column(String(20), default="Low") # High, Medium, Low
    status = Column(SQLEnum(MatchStatusEnum), default=MatchStatusEnum.POTENTIAL, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    lost_item = relationship("Item", foreign_keys=[lost_item_id], back_populates="lost_matches")
    found_item = relationship("Item", foreign_keys=[found_item_id], back_populates="found_matches")
