import logging
from difflib import SequenceMatcher
from app.config import settings
from app.models import Item
from app.ai.text_engine import compute_text_similarity
from app.ai.image_engine import compute_image_similarity

logger = logging.getLogger("matching_engine")

def calculate_string_similarity(str1: str, str2: str) -> float:
    if not str1 or not str2:
        return 0.0
    return SequenceMatcher(None, str1.lower().strip(), str2.lower().strip()).ratio()

def compute_combined_match_score(lost_item: Item, found_item: Item) -> dict:
    """
    Computes weighted confidence score between a LOST item and a FOUND item.
    Weights:
    - Text Similarity: 40%
    - Image Similarity: 30%
    - Category Match: 15%
    - Location Match: 10%
    - Date Match: 5%
    """
    # 1. Text Similarity (name + description)
    text_lost = f"{lost_item.name}. {lost_item.description}"
    text_found = f"{found_item.name}. {found_item.description}"
    text_sim = compute_text_similarity(text_lost, text_found)

    # 2. Image Similarity
    image_sim = 0.0
    has_images = bool(lost_item.image_path and found_item.image_path)
    if has_images:
        image_sim = compute_image_similarity(lost_item.image_path, found_item.image_path)

    # 3. Category Score
    category_score = 1.0 if lost_item.category.lower().strip() == found_item.category.lower().strip() else 0.2

    # 4. Location Similarity
    loc_score = calculate_string_similarity(lost_item.location, found_item.location)

    # 5. Date Score
    date_score = calculate_string_similarity(lost_item.date_event, found_item.date_event)

    # Weight Adjustment if images are missing
    if not has_images:
        # Re-distribute image weight across text and category
        w_text = settings.WEIGHT_TEXT + 0.20
        w_image = 0.0
        w_category = settings.WEIGHT_CATEGORY + 0.10
        w_loc = settings.WEIGHT_LOCATION
        w_date = settings.WEIGHT_DATE
    else:
        w_text = settings.WEIGHT_TEXT
        w_image = settings.WEIGHT_IMAGE
        w_category = settings.WEIGHT_CATEGORY
        w_loc = settings.WEIGHT_LOCATION
        w_date = settings.WEIGHT_DATE

    weighted_score = (
        (text_sim * w_text) +
        (image_sim * w_image) +
        (category_score * w_category) +
        (loc_score * w_loc) +
        (date_score * w_date)
    ) * 100.0

    # Ensure range 0 to 100
    confidence_score = max(0.0, min(100.0, round(weighted_score, 1)))

    if confidence_score >= settings.HIGH_CONFIDENCE_THRESHOLD:
        confidence_level = "High"
    elif confidence_score >= settings.MEDIUM_CONFIDENCE_THRESHOLD:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    return {
        "text_similarity": round(text_sim, 4),
        "image_similarity": round(image_sim, 4),
        "confidence_score": confidence_score,
        "confidence_level": confidence_level
    }
