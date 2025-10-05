from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os
import re

# ----------------------------
# Load environment variables
# ----------------------------
load_dotenv()
API_KEY = os.getenv("NVIDIA_API_KEY")
API_URL = os.getenv("NVIDIA_API_URL")

# ----------------------------
# Initialize FastAPI
# ----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Request body model
# ----------------------------
class Message(BaseModel):
    message: str

# ----------------------------
# Function to generate answer using NVIDIA API
# ----------------------------
def generate_answer(user_input: str):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    system_message = {
        "role": "system",
        "content": (
            "You are a friendly AI assistant that answers all user questions clearly and directly. "
            "You specialize in workout advice but can also answer general questions. "
            "Do not include any internal reasoning or <think> tags. "
            "Make responses user-friendly, concise, and actionable."
        )
    }

    user_message = {
        "role": "user",
        "content": user_input
    }

    data = {
        "model": "nvidia/llama-3.3-nemotron-super-49b-v1.5",
        "messages": [system_message, user_message],
        "temperature": 0.6,
        "top_p": 0.95,
        "max_tokens": 1500
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers, timeout=60)
        response.raise_for_status()
        result = response.json()
        content = result.get("choices")[0]["message"]["content"]
        # Clean up <think> tags if any remain
        cleaned = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
        return cleaned
    except Exception as e:
        print("NVIDIA API ERROR:", e)
        return "Sorry, I couldn't generate a response at the moment."

# ----------------------------
# Chat endpoint
# ----------------------------
@app.post("/chat")
def chat(data: Message):
    reply = generate_answer(data.message)
    return {"reply": reply}

# ----------------------------
# Run with: uvicorn main:app --reload
# ----------------------------
