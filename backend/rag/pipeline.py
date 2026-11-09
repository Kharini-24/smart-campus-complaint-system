
from backend.rag.storage import load_rag_data
from backend.rag.retriever import retrieve_relevant_chunks
from backend.rag.llm import generate_answer


def ask_question(question: str, college_id: str):

    # Select the storage belonging to this college
    storage_dir = f"backend/rag_storage/{college_id}"

    # Load that college's FAISS data
    rag_data = load_rag_data(storage_dir)

    index = rag_data["index"]
    chunks = rag_data["chunks"]
    metadata = rag_data["metadata"]

    # Retrieve relevant chunks
    results = retrieve_relevant_chunks(
        question=question,
        index=index,
        all_chunks=chunks,
        metadata=metadata,
        college_id=college_id,
        top_k=3
    )

    if not results:
        return {
            "answer": "The college documents do not contain enough information to answer this question.",
            "sources": []
        }

    # Prepare context and sources
    context_parts = []
    sources = []

    for result in results:

        meta = result["metadata"]

        source = (
            f"[Source: {meta['document_name']}, "
            f"Page: {meta['page_number']}]"
        )

        context_parts.append(
            f"{source}\n{result['chunk']}"
        )

        sources.append({
            "document_name": meta["document_name"],
            "page_number": meta["page_number"],
            "similarity_score": result["similarity_score"]
        })

    context = "\n\n".join(context_parts)

    # Generate grounded answer
    answer = generate_answer(
        question=question,
        context=context
    )

    return {
        "answer": answer,
        "sources": sources
    }
