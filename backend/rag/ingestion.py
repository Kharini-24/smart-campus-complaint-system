
from pathlib import Path

from backend.rag.pdf_loader import extract_text_from_pdf
from backend.rag.text_cleaner import clean_text
from backend.rag.chunker import create_chunks
from backend.rag.embeddings import generate_embeddings
from backend.rag.vector_store import create_faiss_index


def ingest_pdf(file_path: str, college_id: str, doc_id: str):

    # Step 1: Extract PDF text
    pages = extract_text_from_pdf(file_path)

    all_chunks = []
    metadata = []

    # Step 2: Clean text and create chunks
    for page in pages:

        cleaned_text = clean_text(page["text"])

        chunks = create_chunks(cleaned_text)

        # Step 3: Preserve metadata for every chunk
        for chunk_number, chunk in enumerate(chunks):

            all_chunks.append(chunk)

            metadata.append({
                "chunk_id": len(all_chunks) - 1,
                "college_id": college_id,
                "doc_id": doc_id,
                "document_name": Path(file_path).name,
                "page_number": page["page_number"],
                "chunk_number": chunk_number
            })

    if not all_chunks:
        raise ValueError("No text found in the PDF")

    # Step 4: Generate embeddings
    embeddings = generate_embeddings(all_chunks)

    # Step 5: Create FAISS index
    index = create_faiss_index(embeddings)

    # Step 6: Return everything
    return {
        "index": index,
        "chunks": all_chunks,
        "metadata": metadata
    }
