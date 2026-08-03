from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Item, Match, ItemStatusEnum, MatchStatusEnum
from app.schemas import ItemOut, MatchOut, MatchStatusUpdate, ItemStatusUpdate
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Module"])

@router.get("/items", response_model=List[ItemOut])
def get_all_items(admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Item).order_by(Item.created_at.desc()).all()

@router.get("/matches", response_model=List[MatchOut])
def get_all_matches(admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Match).order_by(Match.confidence_score.desc()).all()

@router.patch("/matches/{match_id}/verify", response_model=MatchOut)
def verify_match(match_id: int, admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match.status = MatchStatusEnum.VERIFIED
    db.commit()
    db.refresh(match)
    return match

@router.patch("/items/{item_id}/collected", response_model=ItemOut)
def mark_collected(item_id: int, admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.status = ItemStatusEnum.COLLECTED
    db.commit()
    db.refresh(item)
    return item
