from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# Gemini API key directly in code
API_KEY = "AIzaSyCWeXF6gmudmVSLWmmD6LbrRqizZLB9Xy0"
client = genai.Client(api_key=API_KEY)

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat(req: ChatRequest):
    user_message = req.message.lower()
    prompt = req.message
    # Add history for context
    if req.history:
        history_text = "\n".join([f"User: {h['user']}\nBot: {h['bot']}" for h in req.history])
        prompt = f"{history_text}\nUser: {req.message}\nBot:"
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return {"reply": response.text}
    except genai.errors.ClientError as e:
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    text_preview = content.decode(errors='ignore')[:500]  # Only first 500 chars
    prompt = f"Analyze this file content:\n{text_preview}"
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return {"reply": response.text}
    except genai.errors.ClientError as e:
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("static/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(f.read())
