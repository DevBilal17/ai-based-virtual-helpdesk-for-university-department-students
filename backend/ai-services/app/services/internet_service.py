
import tiktoken
from app.services.llm_clients import get_groq_llm, get_gemini_llm
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

def get_token_length(text: str):
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))
def choose_llm(query: str, context: str):

    token_len = get_token_length(context)

    complex_keywords = [
        "compare", "difference", "why", "explain", "analyze",
        "deep dive", "architecture", "research"
    ]

    is_complex = any(k in query.lower() for k in complex_keywords)

    if token_len > 4000 or is_complex:
        return "gemini"

    return "groq"
def internet_answer(query: str, tavily_results: list):
    try:
        context = "\n\n".join([
            r["content"] for r in tavily_results
        ])
        if not context:
                return {
                    "answer": "No valid internet results found.",
                    "found_in_context": False,
                    "needs_internet": False,
                    "source": "tavily+empty"
                }
        prompt = ChatPromptTemplate.from_messages([
        ("system", """
    You are an expert research assistant.
    Your job is to answer user questions using ONLY the provided internet search results.
    STRICT RULES:
    - Use only the given context
    - Do NOT use external knowledge
    - If context is incomplete, clearly say "I could not find complete information in the provided sources"
    - Do NOT repeat raw search results
    - Combine information from multiple sources
    - Remove duplication
    - Be precise and factual

    OUTPUT STYLE:
    - Direct and clear answer
    - Use bullet points if needed
    - Keep it short but informative
    """),
        ("human", """
    Question: {question}

    Search Results:
    {context}

    Provide a final consolidated answer.
    """)
    ])

        # -------------------------
        # Choose LLM using your logic
        # -------------------------
        model_choice = choose_llm(query, context)
        llm = get_gemini_llm() if model_choice == "gemini" else get_groq_llm()

        chain = prompt | llm

        response = chain.invoke({
                "question": query,
                "context": context
            })

        return {
                "answer": response.content,
                "found_in_context": False,
                "needs_internet": False,
                "source": f"tavily+{model_choice}"
            }

    except Exception as e:
        return {
            "answer": f"Internet processing failed: {str(e)}",
            "found_in_context": False,
            "needs_internet": False,
            "source": "error_fallback"
        }