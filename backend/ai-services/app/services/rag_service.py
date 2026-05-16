import os, json
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv


from app.utils.text_intelligence import normalize_text
from app.services.store_to_vector_db import get_chroma_client, get_or_create_collection
from app.services.embeddings import get_embedding_model

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
def build_context(docs):
    return "\n\n".join([d.page_content for d in docs])


async def rag_answer(query: str):

    query = normalize_text(query)

    client = get_chroma_client()
    collection = get_or_create_collection(client)
    embedding_model = get_embedding_model()

    vectorstore = Chroma(
        client=client,
        collection_name=collection.name,
        embedding_function=embedding_model
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5}
    )

    docs = retriever.invoke(query)

    if not docs:
        return {
            "answer": "I don’t have this information in the current documents. You can switch to internet search, and I’ll find the latest details for you.",
            "found_in_context": False,
            "needs_internet": True
        }

    context = build_context(docs)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """
You are a Virtual Help Desk AI Assistant.

RULES:
- Use ONLY context
- If context is sufficient → answer from it
- If partial → infer carefully
- If not enough → say I don’t have this information in the current documents. You can switch to internet search, and I’ll find the latest details for you.

Return ONLY JSON:
{{
  "answer": "...",
  "found_in_context": true
}}
"""),
        ("human", "Context:\n{context}\n\nQuestion:\n{question}")
    ])

    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=api_key
    )

    chain = prompt | llm

    response = chain.invoke({
        "context": context,
        "question": query
    })

    try:
        parsed = json.loads(response.content)
    except:
        parsed = {
            "answer": response.content,
            "found_in_context": True
        }

    parsed.setdefault("found_in_context", True)
    parsed["needs_internet"] = not parsed["found_in_context"]

    sources = list(set([
        d.metadata.get("source", "Unknown") for d in docs
    ]))

    return {
        "answer": parsed,
        "sources": sources
    }