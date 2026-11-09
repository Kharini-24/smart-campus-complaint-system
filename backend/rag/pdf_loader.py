import pymupdf
from pathlib import Path


def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text from each page of a PDF.

    Returns:
        A list containing page numbers and extracted text.
    """

    pdf_path = Path(file_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    pages = []

    with pymupdf.open(pdf_path) as document:

        for page_number, page in enumerate(document, start=1):

            text = page.get_text("text")

            pages.append({
                "page_number": page_number,
                "text": text
            })

    return pages