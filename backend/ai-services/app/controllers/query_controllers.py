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


async def query_controller(query: str):
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

        # 3. Prompt Template (system + human) - you can customize this as needed
        prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a highly intelligent AI assistant working inside a Retrieval-Augmented Generation (RAG) system.

You MUST answer ONLY using the provided context.

---

## 📌 STRICT RULES

1. Use ONLY provided context.
2. Do NOT use outside knowledge.
3. Do NOT guess or hallucinate.
4. If answer is not found, use fallback response.
5. ALWAYS return ONLY valid JSON.
6. Do NOT add extra text outside JSON.

---

## 🚨 FALLBACK RESPONSE (NO CONTEXT)

Return EXACTLY:

{{
  "answer": "This specific information is not available in the data provided by the system administrator.",
  "suggestion": "If you want, I can provide general information about this topic. Would you like that?"
}}

---

## 📤 OUTPUT FORMAT (ALWAYS USE THIS)

Return ONLY JSON in this format:

{{
  "answer": "main answer here",
  "code": "code here or null",
  "explanation": "code explanation or null",
  "found_in_context": true
}}

---

## 📌 FIELD RULES

- answer → main response
- code → only if exists else null
- explanation → only if code exists else null
- found_in_context → true/false

---

## 🚫 RULES

- No markdown
- No extra text
- No explanation outside JSON
- Must be valid JSON only
"""),
    ("human", "Context:\n{context}\n\nQuestion:\n{question}")
]) 
        API_KEY = os.getenv("GROQ_API_KEY")
        print(f"Using GROQ API Key: {API_KEY}")
        # 4. LLM
        llm = ChatGroq(
            model="llama-3.1-8b-instant",  
            temperature=0,
            api_key=API_KEY
        )

        # 5. Chain 
        # 5. Advanced Chain Structure
        # We use RunnableParallel to get the context docs AND the LLM response at once
        map_chain = RunnableParallel(
            {"context": retriever, "question": RunnablePassthrough()}
        )
        
        # This part generates the JSON
        generation_chain = prompt | llm | JsonOutputParser()

        # 6. Run Query
        # 6. Run Execution
        # First, find the docs
        input_data = map_chain.invoke(query)
        # Second, generate answer based on those docs
        ai_json_response = generation_chain.invoke(input_data)
        # 7. Extract Source Names from the retrieved docs
        source_files = list(set([
            doc.metadata.get("source", "Unknown") 
            for doc in input_data["context"]
        ]))
        return APIResponse(
            statusCode=200,
            success=True,
            message="Query processed successfully",
            data={
                "answer": ai_json_response, # This is your JSON {answer, code, etc.}
                "sources": source_files    # Now you actually have the sources!
            }
        )

    except Exception as e:
        return APIResponse(
            statusCode=500,
            success=False,
            message=str(e)
        )