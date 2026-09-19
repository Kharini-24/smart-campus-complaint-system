import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_REPO = "Harinik01/smart-campus-complaint-classifier"

tokenizer = AutoTokenizer.from_pretrained(MODEL_REPO)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_REPO)

model.eval()

LABELS = {
    0: "Academics",
    1: "Fees",
    2: "Maintenance",
    3: "Transport",
    4: "Wi-Fi",
}


def predict_category(complaint_text: str) -> str:
    inputs = tokenizer(
        complaint_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128,
    )

    with torch.no_grad():
        outputs = model(**inputs)

    predicted_id = torch.argmax(outputs.logits, dim=1).item()

    return LABELS[predicted_id]