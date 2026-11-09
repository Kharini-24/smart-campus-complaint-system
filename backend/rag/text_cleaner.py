import re
import unicodedata


def clean_text(text: str) -> str:

    # Normalize Unicode characters
    text = unicodedata.normalize("NFKC", text)

    # Fix words split across lines
    text = re.sub(r"(\w+)-\s*\n\s*(\w+)", r"\1\2", text)

    # Remove extra spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove unnecessary blank lines
    text = re.sub(r"\n+", "\n", text)

    return text.strip()