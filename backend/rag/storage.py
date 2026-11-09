
import json
from pathlib import Path

from backend.rag.vector_store import (
    save_faiss_index,
    load_faiss_index
)


def save_rag_data(index, chunks, metadata, storage_dir: str):

    # Create storage directory if it doesn't exist
    directory = Path(storage_dir)
    directory.mkdir(parents=True, exist_ok=True)

    # Save FAISS index
    index_path = directory / "index.faiss"
    save_faiss_index(index, str(index_path))

    # Save chunks and metadata
    data = {
        "chunks": chunks,
        "metadata": metadata
    }

    metadata_path = directory / "metadata.json"

    with open(metadata_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def load_rag_data(storage_dir: str):

    directory = Path(storage_dir)

    index_path = directory / "index.faiss"
    metadata_path = directory / "metadata.json"

    if not index_path.exists() or not metadata_path.exists():
        raise FileNotFoundError("Saved RAG data not found")

    # Load FAISS index
    index = load_faiss_index(str(index_path))

    # Load chunks and metadata
    with open(metadata_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return {
        "index": index,
        "chunks": data["chunks"],
        "metadata": data["metadata"]
    }
