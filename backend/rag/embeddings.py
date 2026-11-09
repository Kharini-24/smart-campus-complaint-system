from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Load the embedding model
model = SentenceTransformer(MODEL_NAME)


def generate_embeddings(chunks: list[str]):
    """
    Convert text chunks into 384-dimensional vectors.
    """

    if not chunks:
        return []

    embeddings = model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embeddings