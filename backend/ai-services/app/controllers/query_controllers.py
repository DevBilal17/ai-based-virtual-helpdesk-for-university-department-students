from app.utils.intent_router import detect_intent
from app.services.rag_service import rag_answer
from app.services.internet_service import internet_answer
# from app.services.internet_service import internet_answer
from tavily import TavilyClient
import os

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

async def process_query_core(
    query: str,
    use_internet: bool = False,
    chat_history: list = None
):
    chat_history = chat_history or []
     # 🔥 FIRST CHECK (IMPORTANT)
    if use_internet:
        try:
            results = tavily.search(
                query=query,
                search_depth="advanced",
                max_results=5
            )

            return {
                "answer": internet_answer(query, results.get("results", [])),
                "sources": ["Tavily Search"]
            }

        except Exception as e:
            return {
                "answer": {
                    "answer": "Internet search failed. Please try again later.",
                    "found_in_context": False,
                    "needs_internet": True
                },
                "sources": []
            }
    if not use_internet:
        intent = detect_intent(query)
    print("DETECTED INTENT:", intent)
    # 1. Greeting
    if intent == "greeting":
        return {
            "answer": {
                "answer": "Hello! I am your AI Help Desk for IT Department. How can I help you?",
                "found_in_context": True,
                "needs_internet": False
            },
            "sources": []
        }

    # 2. Developer info
    if intent == "developer":
        
        return {
            "answer": {
                "answer": "This system is developed by:\n- Muhammad Bilal Aqeel (Team Lead)\n- Abdul Waleed\nBoth are BSIT 8th semester students.",
                "found_in_context": True,
                "needs_internet": False
            },
            "sources": []
        }

    # # 3. Internet mode
    # if use_internet:

    #     results = tavily.search(
    #         query=query,
    #         search_depth="advanced",
    #         max_results=5
    #     )

    #     return {
    #         "answer": internet_answer(query, results["results"]),
    #         "sources": ["Tavily Search"]
    #     }
    # 4. RAG mode
    return await rag_answer(query,chat_history=chat_history)


# async def process_query_core(query: str):
#     try:
#         query = normalize_text(query)
#         # 1. Load DB
#         client = get_chroma_client()
#         collection = get_or_create_collection(client)
#         embedding_model = get_embedding_model()

#         vectorstore = Chroma(
#             client=client,
#             collection_name=collection.name,
#             embedding_function=embedding_model
#         )

#         # 2. Retriever
#         retriever = vectorstore.as_retriever(
#             search_type="similarity",
#             search_kwargs={
#                 "k": 5
#             }
#         )
#         docs = retriever.get_relevant_documents(query)

#         if not docs or len(docs) == 0:
#             return {
#                 "answer": {
#                     "answer": "No relevant context found in documents.",
#                     "found_in_context": False
#                 },
#                 "sources": []
#             }
#         # 3. Prompt
#         prompt = ChatPromptTemplate.from_messages([
# ("system", """
# You are a helpful AI assistant working with document context.

# RULES:
# - Use context as primary source
# - If context is partially relevant, infer logically
# - If context is weak, still try to help
# - Do NOT say "not available" too aggressively
# - Keep response JSON valid

# OUTPUT FORMAT:
# {
#   "answer": "...",
#   "found_in_context": true/false
# }
# """),
# ("human", "Context:\n{context}\n\nQuestion:\n{question}")
# ])
#         # 4. LLM
#         llm = ChatGroq(
#             model="llama-3.1-8b-instant",
#             temperature=0,
#             api_key=os.getenv("GROQ_API_KEY")
#         )

#         # 5. Chain
#         docs = retriever.get_relevant_documents(query)

#         context = build_context(docs)

#         generation_chain = prompt | llm
#         raw = generation_chain.invoke({
#             "context": context,
#             "question": query
#         })

#         result = raw.content

#         # 6. Execute
#         input_data = map_chain.invoke(query)
#         ai_json_response = generation_chain.invoke(input_data)

#         # 7. Sources
#         source_files = list(set([
#             doc.metadata.get("source", "Unknown")
#             for doc in input_data["context"]
#         ]))

#         return {
#             "answer": ai_json_response,
#             "sources": source_files
#         }

#     except Exception as e:
#         raise Exception(str(e))