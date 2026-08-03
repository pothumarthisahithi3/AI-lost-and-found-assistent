import os
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger("image_engine")

_open_clip_model = None
_open_clip_preprocess = None

def get_image_model():
    global _open_clip_model, _open_clip_preprocess
    if _open_clip_model is None:
        try:
            import torch
            import open_clip
            logger.info("Loading OpenCLIP model (ViT-B-32 / laion2b_s34b_b79k)...")
            model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            model.eval()
            _open_clip_model = model
            _open_clip_preprocess = preprocess
            logger.info("OpenCLIP model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load OpenCLIP model: {e}")
            _open_clip_model = False
            _open_clip_preprocess = False
    return _open_clip_model, _open_clip_preprocess

def generate_image_embedding(image_path: str) -> np.ndarray:
    if not image_path or not os.path.exists(image_path):
        return None
    
    model, preprocess = get_image_model()
    if not model or not preprocess:
        return None
    
    try:
        import torch
        image = Image.open(image_path).convert('RGB')
        image_input = preprocess(image).unsqueeze(0)
        
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            
        return image_features.cpu().numpy()[0].astype(np.float32)
    except Exception as e:
        logger.error(f"Error processing image {image_path}: {e}")
        return None

def compute_image_similarity(image_path1: str, image_path2: str) -> float:
    emb1 = generate_image_embedding(image_path1)
    emb2 = generate_image_embedding(image_path2)
    
    if emb1 is None or emb2 is None:
        return 0.0
        
    similarity = float(np.dot(emb1, emb2))
    return max(0.0, min(1.0, similarity))
