import logging
import numpy as np

logger = logging.getLogger("text_engine")

_text_model = None

def get_text_model():
    global _text_model
    if _text_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model: all-MiniLM-L6-v2...")
            _text_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer: {e}")
            _text_model = False
    return _text_model

def generate_text_embedding(text: str) -> np.ndarray:
    model = get_text_model()
    if not model:
        # Fallback dummy vector if model fails to load
        return np.zeros(384, dtype=np.float32)
    
    embedding = model.encode(text, convert_to_numpy=True)
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm
    return embedding.astype(np.float32)

def compute_text_similarity(text1: str, text2: str) -> float:
    emb1 = generate_text_embedding(text1)
    emb2 = generate_text_embedding(text2)
    similarity = float(np.dot(emb1, emb2))
    return max(0.0, min(1.0, similarity))
