from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os, json, traceback
import psycopg2
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import requests
import re
import ast

load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# PostgreSQL setup
conn = psycopg2.connect(
    dbname="insurance_db",
    user="charuarora",
    password="",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

class QueryInput(BaseModel):
    documents: str
    questions: List[str]

def fallback_extract_answers(text):
    answers = []
    collecting = False

    for line in text.splitlines():
        line = line.strip()
        if line.startswith('"answers"') or line.startswith('{ "answers"'):
            collecting = True
            continue
        if collecting:
            if line.startswith("]") or line.startswith("}"):
                break
            if line.endswith(","):
                line = line[:-1]
            line = line.strip().strip('"')
            if line:
                answers.append(line)

    return answers


@app.post("/hackrx/run")
async def ask_query(data: QueryInput):
    try:
        combined_query = " ".join(data.questions)
        query_emb = embedding_model.encode(combined_query)

        cursor.execute("SELECT chunk, embedding FROM policy_chunks")
        rows = cursor.fetchall()

        scored = []
        for chunk_text, emb in rows:
            if emb is None:
                continue
            if isinstance(emb, str):
                emb = np.array(ast.literal_eval(emb))
            else:
                emb = np.array(emb)

            score = 1 - np.dot(query_emb, emb) / (np.linalg.norm(query_emb) * np.linalg.norm(emb))
            scored.append((1 - score, chunk_text))

        top_chunks = sorted(scored, reverse=True)[:3]
        context = "\n\n".join(chunk for _, chunk in top_chunks)

        prompt = f"""
You are an expert insurance policy analyst.

Your task is to analyze a customer query (which may be in informal or shorthand format) and respond with a short, clear, and accurate answer **based only on the provided insurance policy clauses**.

You must follow this **exact JSON format**:

{{
  "answers": [
    "Answer to query 1",
    "Answer to query 2",
    "Answer to query 3",
    "...",
    "Answer to query N"
  ]
}}

Guidelines:
- Understand informal inputs like "46M, knee surgery, Pune, 3-month policy" as a customer asking "Is knee surgery covered for a 46-year-old male in Pune under a policy active for 3 months?"
- Your answer must be **short**, **fact-based**, and **decisive** when possible (e.g., "Yes, knee surgery is covered under the policy.")
- Avoid vague phrases like "may be", "could be", or "might not".
- If the policy clearly supports or excludes a clause, give a definite "Yes..." or "No..." answer.
- If the document does NOT contain relevant information, respond with "Information not available in the provided document."
- Always use professional tone and complete sentences.
- The count and order of answers must match the number of customer queries.

Customer Queries:
{chr(10).join([f"{i+1}. {q}" for i, q in enumerate(data.questions)])}

Relevant Clauses:
{context}
IMPORTANT: Return exactly all the given queries answers in the same order as the queries. Do NOT skip or combine. Only respond in valid JSON as shown above.
"""

        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {TOGETHER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.0
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"LLM Error: {response.text}")

        reply = response.json()["choices"][0]["message"]["content"]

        match = re.search(r'\{\s*"answers"\s*:\s*\[.*?\]\s*\}', reply, re.DOTALL)
        if match:
            structured = json.loads(match.group())
        else:
            answers = fallback_extract_answers(reply)
            if not answers:
                raise ValueError(f"No valid JSON answers found. LLM response:\n\n{reply}")
            structured = {"answers": answers}

        return {"response": structured}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
