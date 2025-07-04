from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from transformers import pipeline, AutoModelForSeq2SeqLM, T5Tokenizer
import spacy
import spacy.cli
import re
from functools import lru_cache

# Download and load spaCy model
spacy.cli.download("en_core_web_sm")
nlp = spacy.load("en_core_web_sm")

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://flashcards-ai-g0mp.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input validation
class InputText(BaseModel):
    text: str = Field(..., min_length=10, max_length=500)
    num_questions: int = Field(default=1, ge=1, le=2)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": f"Internal server error: {str(exc)}"},
    )

# Load lightweight T5 model for QG
@lru_cache()
def get_qg_pipeline():
    model_name = "iarfmoose/tiny-t5-qa-qg"
    try:
        tokenizer = T5Tokenizer.from_pretrained(model_name, use_fast=False, legacy=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        return pipeline("text2text-generation", model=model, tokenizer=tokenizer, device=-1)
    except Exception as e:
        raise RuntimeError(f"Failed to load QG model: {e}")

# Extract answer candidates using spaCy noun chunks
def extract_answers(text: str, max_answers: int = 2):
    doc = nlp(text)
    seen = set()
    answers = []

    for chunk in doc.noun_chunks:
        candidate = chunk.text.strip()
        if len(candidate.split()) <= 5 and candidate.lower() not in seen:
            answers.append(candidate)
            seen.add(candidate.lower())
        if len(answers) >= max_answers:
            break
    return answers or ["this topic"]

@app.post("/generate")
def generate_flashcards(input: InputText):
    paragraph = input.text.strip()
    num = min(input.num_questions, 2)

    if not paragraph:
        return {"flashcards": []}

    try:
        qg_pipeline = get_qg_pipeline()
        answers = extract_answers(paragraph, max_answers=num)

        flashcards = []

        for answer in answers:
            # Highlight answer in text
            highlighted_text = re.sub(
                rf'\b{re.escape(answer)}\b',
                f'<hl> {answer} <hl>',
                paragraph,
                count=1
            )
            prompt = f"generate question: {highlighted_text}"

            outputs = qg_pipeline(
                prompt,
                max_length=32,
                do_sample=False,
                num_return_sequences=1
            )

            question = outputs[0]["generated_text"].strip()
            if not question.endswith("?"):
                question += "?"

            # Use original noun chunk as fallback answer
            flashcards.append({
                "question": question,
                "answer": answer
            })

        return {"flashcards": flashcards}

    except Exception as e:
        return {"error": f"Something went wrong: {str(e)}", "flashcards": []}

@app.get("/")
def root():
    return {"app": "working"}
