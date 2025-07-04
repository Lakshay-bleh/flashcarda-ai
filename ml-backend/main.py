from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from transformers import (
    pipeline,
    AutoModelForSeq2SeqLM,
    AutoModelForQuestionAnswering,
    T5Tokenizer,
    AutoTokenizer
)
import spacy
import spacy.cli
import re
from functools import lru_cache
import torch

# Download spaCy model if not already installed
spacy.cli.download("en_core_web_sm")

app = FastAPI()

# Allow frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://flashcards-ai-g0mp.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy for noun phrase extraction
nlp = spacy.load("en_core_web_sm")


# Handle unexpected exceptions globally
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": f"Internal server error: {str(exc)}"},
    )


# Improved input validation
class InputText(BaseModel):
    text: str = Field(..., min_length=10, max_length=1500)
    num_questions: int = Field(default=3, ge=1, le=5)


# Question generation model + tokenizer (T5 uses SentencePiece)
@lru_cache()
def get_qg_pipeline():
    model_name = "valhalla/t5-small-qa-qg-hl"
    try:
        tokenizer = T5Tokenizer.from_pretrained(model_name, use_fast=False)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        return pipeline("text2text-generation", model=model, tokenizer=tokenizer)
    except Exception as e:
        raise RuntimeError(f"Failed to load QG model: {e}")


# Question answering pipeline (DistilBERT SQuAD)
@lru_cache()
def get_qa_pipeline():
    model_name = "distilbert-base-cased-distilled-squad"
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForQuestionAnswering.from_pretrained(model_name)
        return pipeline("question-answering", model=model, tokenizer=tokenizer)
    except Exception as e:
        raise RuntimeError(f"Failed to load QA model: {e}")


# Extract answer candidates from text using spaCy noun chunks
def extract_answers(text, max_answers=10):
    doc = nlp(text)
    answers = []
    for chunk in doc.noun_chunks:
        candidate = chunk.text.strip()
        if len(candidate.split()) <= 5 and candidate.lower() not in answers:
            answers.append(candidate)
        if len(answers) >= max_answers:
            break
    return answers


@app.post("/generate")
def generate_flashcards(input: InputText):
    paragraph = input.text.strip()
    num = min(input.num_questions, 5)

    if not paragraph:
        return {"flashcards": []}

    try:
        qg_pipeline = get_qg_pipeline()
        qa_pipeline = get_qa_pipeline()

        answers = extract_answers(paragraph, max_answers=num)
        if not answers:
            answers = ["this topic"]

        flashcards = []

        for answer in answers:
            # Highlight the answer in text
            highlighted_text = re.sub(
                rf'\b{re.escape(answer)}\b',
                f'<hl> {answer} <hl>',
                paragraph,
                count=1
            )
            prompt = f"generate question: {highlighted_text}"

            outputs = qg_pipeline(
                prompt,
                max_length=64,
                do_sample=False,
                num_return_sequences=1
            )

            question = outputs[0]["generated_text"].strip()
            if not question.endswith("?"):
                question += "?"

            # Get answer from context using QA model
            try:
                answer_obj = qa_pipeline(question=question, context=paragraph)
                answer_text = answer_obj.get("answer", "").strip() or answer
            except Exception:
                answer_text = answer

            flashcards.append({
                "question": question,
                "answer": answer_text
            })

            if len(flashcards) >= num:
                break

        return {"flashcards": flashcards}

    except Exception as e:
        return {"error": f"Something went wrong: {str(e)}", "flashcards": []}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"app": "working"}
