import logging
from sqlalchemy.orm import Session
from app.models import Item, ItemTypeEnum, ItemStatusEnum, Match, MatchStatusEnum
from app.ai.matching_engine import compute_combined_match_score
from app.config import settings
from app.utils.email import send_match_notification

logger = logging.getLogger("matching_service")

def process_item_matching(new_item: Item, db: Session):
    """
    Triggers automatic AI matching whenever a new LOST or FOUND report is created.
    Searches opposite report types, computes similarity, and persists qualifying matches.
    """
    opposite_type = ItemTypeEnum.FOUND if new_item.type == ItemTypeEnum.LOST else ItemTypeEnum.LOST
    
    candidate_items = db.query(Item).filter(
        Item.type == opposite_type,
        Item.status == ItemStatusEnum.ACTIVE,
        Item.id != new_item.id
    ).all()

    new_matches = []
    for candidate in candidate_items:
        if new_item.type == ItemTypeEnum.LOST:
            lost_item = new_item
            found_item = candidate
        else:
            lost_item = candidate
            found_item = new_item

        # Check existing match record to avoid duplicates
        existing_match = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id
        ).first()

        if existing_match:
            continue

        res = compute_combined_match_score(lost_item, found_item)
        
        # Only save if confidence meets minimum threshold
        if res["confidence_score"] >= settings.MINIMUM_MATCH_THRESHOLD:
            match_record = Match(
                lost_item_id=lost_item.id,
                found_item_id=found_item.id,
                text_similarity=res["text_similarity"],
                image_similarity=res["image_similarity"],
                confidence_score=res["confidence_score"],
                confidence_level=res["confidence_level"],
                status=MatchStatusEnum.POTENTIAL
            )
            db.add(match_record)
            db.commit()
            db.refresh(match_record)
            new_matches.append(match_record)

            # Trigger email notification if high confidence
            if res["confidence_score"] >= settings.HIGH_CONFIDENCE_THRESHOLD:
                send_match_notification(
                    recipient_email=lost_item.owner.email,
                    recipient_name=lost_item.owner.name,
                    lost_item_name=lost_item.name,
                    found_item_name=found_item.name,
                    found_location=found_item.location,
                    confidence_score=res["confidence_score"]
                )

    return new_matches
