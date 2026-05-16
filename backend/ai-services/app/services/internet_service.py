from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    api_key=api_key
)

def internet_answer(query: str, tavily_results: list):

    context = "\n\n".join([
        r["content"] for r in tavily_results
    ])

    prompt = ChatPromptTemplate.from_messages([
        ("system", """
You are a helpful assistant.

Summarize internet search results clearly and accurately.

Rules:
- Use only provided internet context
- Be concise
- No hallucination
"""),
        ("human", "Question: {question}\n\nContext:\n{context}")
    ])

    chain = prompt | llm

    response = chain.invoke({
        "question": query,
        "context": context
    })

    return {
        "answer": response.content,
        "found_in_context": False,
        "needs_internet": False,
        "source": "tavily+llm"
    }