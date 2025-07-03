from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForQuestionAnswering
import spacy
import spacy.cli
import re
from functools import lru_cache
import torch

# Download spaCy model if not present
spacy.cli.download("en_core_web_sm")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model globally (small)
nlp = spacy.load("en_core_web_sm")

@lru_cache()
def get_qg_pipeline():
    model_name = "valhalla/t5-small-qa-qg-hl"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    # Try loading with fp16 if possible (reduce memory usage)
    try:
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name, torch_dtype=torch.float16)
    except Exception:
        # fallback to default if fp16 not supported
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return pipeline("text2text-generation", model=model, tokenizer=tokenizer)

@lru_cache()
def get_qa_pipeline():
    model_name = "distilbert-base-cased-distilled-squad"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    try:
        model = AutoModelForQuestionAnswering.from_pretrained(model_name, torch_dtype=torch.float16)
    except Exception:
        model = AutoModelForQuestionAnswering.from_pretrained(model_name)
    return pipeline("question-answering", model=model, tokenizer=tokenizer)

class InputText(BaseModel):
    text: str
    num_questions: int = 3  # default reduced for memory

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
    num = min(input.num_questions, 5)  # cap max questions to 5 for memory

    if not paragraph:
        return {"flashcards": []}

    try:
        qg_pipeline = get_qg_pipeline()
        qa_pipeline = get_qa_pipeline()

        answers = extract_answers(paragraph, max_answers=num)
        flashcards = []

        for answer in answers:
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
