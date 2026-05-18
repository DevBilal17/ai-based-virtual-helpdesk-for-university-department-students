from functools import lru_cache
import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from google import genai
@lru_cache(maxsize=1)
def get_groq_llm():
    return ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )


@lru_cache(maxsize=1)
def get_gemini_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )




client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

for model in client.models.list():
    print(model.name)