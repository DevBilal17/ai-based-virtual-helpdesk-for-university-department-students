from app.utils.response import APIResponse
from app.services.store_to_vector_db import get_chroma_client, get_or_create_collection
from app.services.embeddings import get_embedding_model


from langchain_chroma import Chroma

from langchain_core.prompts import ChatPromptTemplate

from langchain_core.runnables import RunnablePassthrough,RunnableParallel

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser


from langchain_mistralai import ChatMistralAI
from langchain_groq import ChatGroq
import os

async def process_query_core(query: str):
    try:
        # 1. Load DB
        client = get_chroma_client()
        collection = get_or_create_collection(client)
        embedding_model = get_embedding_model()

        vectorstore = Chroma(
            client=client,
            collection_name=collection.name,
            embedding_function=embedding_model
        )

        # 2. Retriever
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        # 3. Prompt
        prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a highly intelligent AI assistant working inside a RAG system.

RULES:
- Use ONLY context
- No hallucination
- Return ONLY JSON

OUTPUT FORMAT:
{{
  "answer": "...",
  "code": null,
  "explanation": null,
  "found_in_context": true
}}

If not found:
{{
  "answer": "This specific information is not available in the provided data.",
  "suggestion": "Do you want general info?"
}}
"""),
    ("human", "Context:\n{context}\n\nQuestion:\n{question}")
])

        # 4. LLM
        llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0,
            api_key=os.getenv("GROQ_API_KEY")
        )

        # 5. Chain
        map_chain = RunnableParallel(
            {
                "context": retriever,
                "question": RunnablePassthrough()
            }
        )

        generation_chain = prompt | llm | JsonOutputParser()

        # 6. Execute
        input_data = map_chain.invoke(query)
        ai_json_response = generation_chain.invoke(input_data)

        # 7. Sources
        source_files = list(set([
            doc.metadata.get("source", "Unknown")
            for doc in input_data["context"]
        ]))

        return {
            "answer": ai_json_response,
            "sources": source_files
        }

    except Exception as e:
        raise Exception(str(e))