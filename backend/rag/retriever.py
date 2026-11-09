
from backend.rag.embeddings import generate_embeddings
from backend.rag.vector_store import search_faiss_index


def retrieve_relevant_chunks(
    question: str,
    index,
    all_chunks: list[str],
    metadata: list[dict],
    college_id: str,
    top_k: int = 3
):
    """
    Retrieve relevant chunks belonging only
    to the requested college.
    """

    # Step 1: Find chunks belonging to this college
    allowed_indices = [
        i for i, item in enumerate(metadata)
        if item["college_id"] == college_id
    ]

    if not allowed_indices:
        return []

    # Step 2: Generate question embedding
    query_embedding = generate_embeddings([question])

    # Step 3: Search FAISS
    scores, indices = search_faiss_index(
        index,
        query_embedding,
        top_k=index.ntotal
    )

    # Step 4: Filter results by college
    results = []

    for score, idx in zip(scores, indices):

        if idx == -1:
            continue

        if int(idx) in allowed_indices:

            results.append({
                "chunk": all_chunks[int(idx)],
                "metadata": metadata[int(idx)],
                "similarity_score": float(score)
            })

        if len(results) == top_k:
            break

    return results
