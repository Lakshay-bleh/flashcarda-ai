# run using uvicorn main:app --reload
# first use .venv/Scripts/activate
# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    pipeline,
    AutoModelForQuestionAnswering,
)
import spacy
import spacy.cli
import re

# Download spaCy model if not present
spacy.cli.download("en_core_web_sm")

# Setup app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spacy for noun chunk extraction
nlp = spacy.load("en_core_web_sm")

# Use large QG model
qg_model_name = "valhalla/t5-large-qa-qg-hl"
qg_tokenizer = AutoTokenizer.from_pretrained(qg_model_name)
qg_model = AutoModelForSeq2SeqLM.from_pretrained(qg_model_name)
qg_pipeline = pipeline("text2text-generation", model=qg_model, tokenizer=qg_tokenizer)

# Use DeBERTa v3 large QA model
qa_model_name = "deepset/deberta-v3-large-squad2"
qa_tokenizer = AutoTokenizer.from_pretrained(qa_model_name)
qa_model = AutoModelForQuestionAnswering.from_pretrained(qa_model_name)
qa_pipeline = pipeline("question-answering", model=qa_model, tokenizer=qa_tokenizer)

# Request schema
class InputText(BaseModel):
    text: str
    num_questions: int = 5

def extract_answers(text, max_answers=10):
    """Extract candidate answers (noun chunks) to highlight."""
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
    num = input.num_questions

    if not paragraph:
        return {"flashcards": []}

    try:
        answers = extract_answers(paragraph, max_answers=num)
        flashcards = []

        for answer in answers:
            # Highlight answer with <hl> tokens inside the paragraph
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

            # Use QA model to find answer from context for the generated question
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
