from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List
import requests
import tempfile
import os
import json
import re
import traceback

from dotenv import load_dotenv
from functions import file_loader

load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
TEAM_TOKEN = "fa641c0ed8a31d89ec262969f1b0f3371b202957ffd6c6f1996e6dbf102866a5"

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

security = HTTPBearer()

# Request model
class HackRxRequest(BaseModel):
    documents: str
    questions: List[str]

# Fallback if LLM output isn't JSON
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
async def hackrx_run(data: HackRxRequest, request: Request, token: HTTPAuthorizationCredentials = security):
    try:
        # === Auth Check ===
        if token.credentials != TEAM_TOKEN:
            raise HTTPException(status_code=401, detail="Invalid Bearer Token")

        # === Download and save the file ===
        response = requests.get(data.documents)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to download document.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            file_path = tmp.name

        # === Load, split, embed, index ===
        retriever, _ = file_loader(file_path)

        # === Retrieve relevant content ===
        combined_query = " ".join(data.questions)
        docs = retriever.get_relevant_documents(combined_query)
        context = "\n\n".join([doc.page_content for doc in docs[:3]])

        # === Build LLM prompt ===
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

        # === Call LLM ===
        llm_response = requests.post(
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

        if llm_response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"LLM Error: {llm_response.text}")

        reply = llm_response.json()["choices"][0]["message"]["content"]

        # === Extract answers from JSON ===
        match = re.search(r'\{\s*"answers"\s*:\s*\[.*?\]\s*\}', reply, re.DOTALL)
        if match:
            structured = json.loads(match.group())
        else:
            answers = fallback_extract_answers(reply)
            if not answers:
                raise ValueError("No valid JSON output from LLM.")
            structured = {"answers": answers}

        return structured

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
