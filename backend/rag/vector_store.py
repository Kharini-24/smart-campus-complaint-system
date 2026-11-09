import faiss
import numpy as np


def create_faiss_index(embeddings):
    """
    Create a FAISS index using inner product similarity.
    """

    if len(embeddings) == 0:
        raise ValueError("No embeddings provided")

    embeddings = np.asarray(embeddings, dtype=np.float32)

    dimension = embeddings.shape[1]

    # Create an exact inner-product index
    index = faiss.IndexFlatIP(dimension)

    # Store embeddings
    index.add(embeddings)

    return index


def search_faiss_index(index, query_embedding, top_k=3):
    """
    Search for the most similar chunks.
    """

    query_embedding = np.asarray(
        query_embedding, dtype=np.float32
    ).reshape(1, -1)

    k = min(top_k, index.ntotal)

    scores, indices = index.search(query_embedding, k)

    return scores[0], indices[0]


def save_faiss_index(index, file_path):
    faiss.write_index(index, file_path)


def load_faiss_index(file_path):
    return faiss.read_index(file_path)