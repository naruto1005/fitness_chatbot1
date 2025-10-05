from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

# Load Hugging Face instruction model (bigger one for better answers)
generator = pipeline("text2text-generation", model="google/flan-t5-large")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
def chat(data: Message):
    try:
        # Give clear instruction so model knows to generate a plan
        prompt = f"Provide a detailed helpful response:\n{data.message}"
        result = generator(prompt, max_length=400)
        reply = result[0]["generated_text"]
    except Exception as e:
        print("ERROR:", e)
        reply = "Sorry, there was a problem generating a response."

    return {"reply": reply}
