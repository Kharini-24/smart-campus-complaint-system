
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Gemini API key not found!")

client = genai.Client(api_key=api_key)


def generate_answer(question: str, context: str):

    prompt = f"""
You are a helpful Smart Campus Assistant.

Your task is to answer the student's question
using ONLY the information in the provided context.

STRICT RULES:

1. Do not use outside knowledge.
2. Do not invent facts, rules, or policies.
3. If the context does not contain the answer,
   clearly say that the college documents do not
   contain enough information.
4. Include the document name and page number
   as a source in your answer.
5. Cite only sources provided in the context.
6. If multiple sources support the answer,
   include their relevant citations.
7. Keep the answer clear and easy to understand.

CONTEXT:
{context}

STUDENT QUESTION:
{question}

ANSWER:
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text
