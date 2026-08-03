from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Match, Item
from app.schemas import MatchOut, MatchStatusUpdate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.get("/my", response_model=List[MatchOut])
def get_user_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns all matches relevant to the logged-in user (where they own either the lost or found item).
    """
    user_item_ids = [item.id for item in current_user.items]
    if not user_item_ids:
        return []
    
    matches = db.query(Match).filter(
        (Match.lost_item_id.in_(user_item_ids)) | (Match.found_item_id.in_(user_item_ids))
    ).order_by(Match.confidence_score.desc()).all()
    
    return matches

@router.patch("/{match_id}/status", response_model=MatchOut)
def update_match_status(
    match_id: int,
    status_update: MatchStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Check permission
    is_owner = (match.lost_item.user_id == current_user.id or match.found_item.user_id == current_user.id)
    if not is_owner and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    match.status = status_update.status
    db.commit()
    db.refresh(match)
    return match
