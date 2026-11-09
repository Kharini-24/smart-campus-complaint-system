
from transformers import AutoTokenizer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


def create_chunks(text: str, chunk_size: int = 200, overlap: int = 50):

    if chunk_size <= 0 or overlap < 0 or overlap >= chunk_size:
        raise ValueError("Invalid chunk size or overlap")

    # Get token IDs directly without the high-level length check
    tokenizer.backend_tokenizer.no_truncation()

    tokens = tokenizer.backend_tokenizer.encode(
     text,
     add_special_tokens=False
    ).ids

    chunks = []

    start = 0

    while start < len(tokens):

        end = start + chunk_size
        chunk_tokens = tokens[start:end]

        chunk_text = tokenizer.decode(
            chunk_tokens,
            skip_special_tokens=True
        )

        if chunk_text.strip():
            chunks.append(chunk_text)

        start += chunk_size - overlap

    return chunks
