from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from transformers import pipeline, AutoModelForSeq2SeqLM, T5Tokenizer
import spacy, spacy.cli, re
from functools import lru_cache

# Download and load spaCy model
spacy.cli.download("en_core_web_sm")
nlp = spacy.load("en_core_web_sm")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["https://flashcards-ai-g0mp.onrender.com"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class InputText(BaseModel):
    text: str = Field(..., min_length=10, max_length=500)
    num_questions: int = Field(default=1, ge=1, le=2)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})

@lru_cache()
def get_qa_qg_pipeline():
    model_name = "valhalla/t5-small-qa-qg-hl"
    tokenizer = T5Tokenizer.from_pretrained(model_name, use_fast=False, legacy=True)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return pipeline("text2text-generation", model=model, tokenizer=tokenizer, device=-1)

def extract_answers(text, max_answers=2):
    seen, answers = set(), []
    for chunk in nlp(text).noun_chunks:
        c = chunk.text.strip()
        if c.lower() not in seen and len(c.split()) <= 5:
            seen.add(c.lower()); answers.append(c)
        if len(answers) >= max_answers: break
    return answers or ["this topic"]

@app.post("/generate")
def generate_flashcards(input: InputText):
    p = input.text.strip(); n = input.num_questions
    if not p: return {"flashcards": []}
    pipe = get_qa_qg_pipeline()
    answers = extract_answers(p, max_answers=n)
    cards = []
    for ans in answers:
        # Generate question
        q_in = f"generate question: <hl> {ans} <hl> {p}"
        q_out = pipe(q_in, max_length=64, do_sample=False)[0]["generated_text"].strip()
        if not q_out.endswith("?"): q_out += "?"
        # Generate answer from question and context
        qa_in = {"question": q_out, "context": p}
        a_out = pipe(qa_in, max_length=64, do_sample=False)[0]["generated_text"].strip()
        cards.append({"question": q_out, "answer": a_out or ans})
    return {"flashcards": cards}

@app.get("/health")
def health_check(): return {"status": "ok"}
@app.get("/")
def root(): return {"app": "working"}
