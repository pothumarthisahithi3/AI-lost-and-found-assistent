import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.models import RoleEnum, ItemTypeEnum, ItemStatusEnum, MatchStatusEnum

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Item Schemas
class ItemCreate(BaseModel):
    name: str
    category: str
    description: str
    date_event: str
    location: str
    type: ItemTypeEnum

class ItemOut(BaseModel):
    id: int
    user_id: int
    type: ItemTypeEnum
    name: str
    category: str
    description: str
    date_event: str
    location: str
    image_path: Optional[str] = None
    status: ItemStatusEnum
    created_at: datetime.datetime
    owner: Optional[UserOut] = None

    class Config:
        from_attributes = True

# Match Schemas
class MatchOut(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    text_similarity: float
    image_similarity: float
    confidence_score: float
    confidence_level: str
    status: MatchStatusEnum
    created_at: datetime.datetime
    lost_item: Optional[ItemOut] = None
    found_item: Optional[ItemOut] = None

    class Config:
        from_attributes = True

class MatchStatusUpdate(BaseModel):
    status: MatchStatusEnum

class ItemStatusUpdate(BaseModel):
    status: ItemStatusEnum
