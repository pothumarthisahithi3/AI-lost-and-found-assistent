import logging
import numpy as np

logger = logging.getLogger("faiss_indexer")

class VectorIndexer:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.item_ids = []
        self.index = None
        self._init_index()

    def _init_index(self):
        try:
            import faiss
            # Inner product index for normalized vectors (cosine similarity)
            self.index = faiss.IndexFlatIP(self.dimension)
        except Exception as e:
            logger.error(f"FAISS not available: {e}")
            self.index = None

    def add_vector(self, item_id: int, vector: np.ndarray):
        if self.index is None or vector is None:
            return
        vector = np.ascontiguousarray(vector.reshape(1, -1), dtype=np.float32)
        self.index.add(vector)
        self.item_ids.append(item_id)

    def search(self, query_vector: np.ndarray, top_k: int = 10):
        if self.index is None or query_vector is None or len(self.item_ids) == 0:
            return []
        
        query_vector = np.ascontiguousarray(query_vector.reshape(1, -1), dtype=np.float32)
        k = min(top_k, len(self.item_ids))
        distances, indices = self.index.search(query_vector, k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.item_ids) and idx >= 0:
                results.append((self.item_ids[idx], float(dist)))
        return results

text_faiss_index = VectorIndexer(dimension=384)
image_faiss_index = VectorIndexer(dimension=512)
