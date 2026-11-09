from backend.rag.ingestion import ingest_pdf
from backend.rag.storage import save_rag_data

pdf_path = "backend/sample_documents/college_handbook.pdf"

result = ingest_pdf(
    file_path=pdf_path,
    college_id="college_001",
    doc_id="doc_001"
)

save_rag_data(
    index=result["index"],
    chunks=result["chunks"],
    metadata=result["metadata"],
    storage_dir="backend/rag_storage/college_001"
)

print("College A re-ingestion successful!")
print("Chunks:", len(result["chunks"]))
print("Vectors:", result["index"].ntotal)
print("College ID:", result["metadata"][0]["college_id"])