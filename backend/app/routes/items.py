import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Item, ItemTypeEnum, ItemStatusEnum
from app.schemas import ItemOut, ItemStatusUpdate
from app.utils.auth import get_current_user
from app.config import settings
from app.services.matching import process_item_matching

router = APIRouter(prefix="/items", tags=["Items"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/", response_model=ItemOut)
async def create_item(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date_event: str = Form(...),
    location: str = Form(...),
    type: ItemTypeEnum = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_image_path = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        destination = os.path.join(settings.UPLOAD_DIR, unique_filename)
        
        contents = await image.read()
        with open(destination, "wb") as f:
            f.write(contents)
        saved_image_path = f"/uploads/{unique_filename}"

    item = Item(
        user_id=current_user.id,
        name=name,
        category=category,
        description=description,
        date_event=date_event,
        location=location,
        type=type,
        image_path=saved_image_path,
        status=ItemStatusEnum.ACTIVE
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Trigger background AI matching
    process_item_matching(item, db)

    return item

@router.get("/my", response_model=List[ItemOut])
def get_my_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.user_id == current_user.id).order_by(Item.created_at.desc()).all()

@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.patch("/{item_id}/status", response_model=ItemOut)
def update_item_status(
    item_id: int,
    status_update: ItemStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    item.status = status_update.status
    db.commit()
    db.refresh(item)
    return item
