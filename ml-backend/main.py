from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from transformers import pipeline, AutoModelForSeq2SeqLM, T5Tokenizer
import spacy
from functools import lru_cache

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://flashcards-ai-g0mp.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class InputText(BaseModel):
    text: str = Field(..., min_length=10, max_length=500)
    num_questions: int = Field(default=1, ge=1, le=2)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})

# Lazy-load and cache the spaCy model
@lru_cache()
def get_nlp():
    return spacy.load("en_core_web_sm")

# Lazy-load and cache the transformers pipeline
@lru_cache()
def get_qa_qg_pipeline():
    model_name = "valhalla/t5-small-qa-qg-hl"
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Extract top N short noun phrases
def extract_answers(text, max_answers=2):
    nlp = get_nlp()
    seen, answers = set(), []
    for chunk in nlp(text).noun_chunks:
        c = chunk.text.strip()
        if c.lower() not in seen and 1 <= len(c.split()) <= 5:
            seen.add(c.lower())
            answers.append(c)
        if len(answers) >= max_answers:
            break
    return answers or ["this topic"]

@app.post("/generate")
def generate_flashcards(input: InputText):
    text = input.text.strip()
    num = input.num_questions
    if not text:
        return {"flashcards": []}

    pipe = get_qa_qg_pipeline()
    answers = extract_answers(text, max_answers=num)
    cards = []

    for ans in answers:
        q_in = f"generate question: <hl> {ans} <hl> {text}"
        q_out = pipe(q_in, max_length=64, do_sample=False)[0]["generated_text"].strip()
        if not q_out.endswith("?"):
            q_out += "?"

        qa_in = f"question: {q_out} context: {text}"
        a_out = pipe(qa_in, max_length=64, do_sample=False)[0]["generated_text"].strip()

        cards.append({
            "question": q_out,
            "answer": a_out or ans
        })

    return {"flashcards": cards}

# Health check routes
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"app": "working"}
