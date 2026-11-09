from fastapi import APIRouter, Depends, HTTPException

from backend.auth import get_current_student
from backend.rag.pipeline import ask_question

router = APIRouter(prefix="/api/rag", tags=["RAG"])


@router.post("/ask")
async def ask_rag_question(
    payload: dict,
    current_user: dict = Depends(get_current_student)
):
    question = payload.get("question", "").strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    college_id = current_user.get("college_id")

    if not college_id:
        raise HTTPException(
            status_code=403,
            detail="Your account is not associated with a college"
        )

    try:
        result = ask_question(
            question=question,
            college_id=college_id
        )

        return {
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="College documents have not been uploaded yet"
        )

    except Exception as e:
      print("RAG ERROR:", repr(e))
      raise HTTPException(
        status_code=500,
        detail="Unable to process your question right now"
    )