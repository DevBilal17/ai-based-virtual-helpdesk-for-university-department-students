import os, json
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv


from app.utils.text_intelligence import normalize_teacher_entities, normalize_text, smart_normalize_query
from app.services.store_to_vector_db import get_chroma_client, get_or_create_collection
from app.services.embeddings import get_embedding_model

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
def build_context(docs):
    return "\n\n".join([d.page_content for d in docs])


# ---------------------------
# Helper: extract metadata
# ---------------------------
def extract_navigation_info(docs, matched_person=None):
    office_node_id = None
    door_node_id = None

    for d in docs:
        meta = d.metadata or {}

        # prioritize matched person doc
        full_name = (
            meta.get("basicInfo", {}).get("fullName")
            or meta.get("fullName")
        )

        if matched_person and full_name:
            if matched_person.lower() not in full_name.lower():
                continue

        # office node
        office_node_id = (
            meta.get("officeNodeId")
            or meta.get("basicInfo", {}).get("officeNodeId")
            or meta.get("contact", {}).get("officeNodeId")
            or office_node_id
        )

        # door node
        door_node_id = (
            meta.get("doorNodeId")
            or meta.get("basicInfo", {}).get("doorNodeId")
            or meta.get("contact", {}).get("doorNodeId")
            or door_node_id
        )

        # stop if both found
        if office_node_id or door_node_id:
            break

    return office_node_id, door_node_id

def extract_name_from_query(query: str):
    words = query.lower().split()

    # remove noise words
    stop_words = [
        "i", "want", "to", "visit", "the",
        "give", "me", "ok", "please"
    ]

    cleaned = [w for w in words if w not in stop_words]

    if len(cleaned) > 0:
        return " ".join(cleaned).title()

    return None

def get_publication_count(docs):
    for d in docs:
        meta = d.metadata or {}
        pubs = meta.get("publications")
        if isinstance(pubs, list):
            return len(pubs)
    return None

def extract_last_person(chat_history):
    for msg in reversed(chat_history):
        content = msg.get("content", "")

        # assistant messages check
        if "Dr." in content or "Sir" in content:
            return content

    return None
def get_last_matched_person(chat_history):
    for msg in reversed(chat_history):
        person = msg.get("matched_person")

        if person:
            return person

    return None
def format_chat_history(chat_history):
    if not chat_history:
        return ""

    formatted = []

    for msg in chat_history:
        role = msg.get("role", "user")
        content = msg.get("content", "")

        if role == "assistant":
            formatted.append(f"Assistant: {content}")
        else:
            formatted.append(f"User: {content}")

    return "\n".join(formatted)
def should_inject_entity(query: str):
    triggers = [
                "his", "her", "him",
                "office", "location",
                "meet", "visit", "where"
            ]
    return any(t in query.lower() for t in triggers)
# ---------------------------
# MAIN RAG FUNCTION
# ---------------------------
async def rag_answer(query: str, chat_history=None):
    chat_history = chat_history or []
    print("CHAT HISTORY:", chat_history)
    # query = normalize_text(query)
    query_obj = smart_normalize_query(query)

    query = query_obj["cleaned"]

    print("NORMALIZED QUERY:", query)
    history_entity = get_last_matched_person(chat_history)
    # query_entity = extract_name_from_query(query)

    entity = history_entity 

    def should_inject(query):
        triggers = ["visit", "office", "location", "meet", "where"]
        return any(t in query.lower() for t in triggers)

    if entity and should_inject(query):
        query = f"{entity} {query}"
    print("ENTITY:", entity)
    print("QUERY BEFORE SEARCH:", query)
    


    # ---------------------------
    # Clean navigation query
    # ---------------------------
    print(query)
    navigation_keywords = [
        "currently i am at",
        "i am at",
        "from here",
        "give me location",
        "give me directions",
        "navigate",
        "direction",
        "route",
        "how do i go",
        "take me to",
        "i want to visit",
        "visit",
        "location"
    ]

    clean_query = query

    for kw in navigation_keywords:
        clean_query = clean_query.replace(kw, "")

    clean_query = " ".join(clean_query.split())

    # clean_query = normalize_teacher_entities(clean_query)

    print("CLEAN QUERY:", clean_query)
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
    final_query = clean_query

    if entity and entity.lower() not in final_query.lower():
        final_query = f"{entity} {final_query}"
    docs = retriever.invoke(final_query)

   
    # ---------------------------
    # No context found
    # ---------------------------
    if not docs:
        return {
            "answer": "I don’t have this information in the current documents. You can switch to internet search, and I’ll find the latest details for you.",
            "found_in_context": False,
            "needs_internet": True,
            "officeNodeId": None,
            "doorNodeId": None
        }

    # ---------------------------
    # Build context
    # ---------------------------
    context = build_context(docs)
    formatted_history = format_chat_history(chat_history)
    print(formatted_history)
    # ---------------------------
    # Extract navigation metadata
    # ---------------------------
    # office_node_id, door_node_id = extract_navigation_info(docs)
    publications_count = get_publication_count(docs)
    # ---------------------------
    # Prompt
    # ---------------------------
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", """
# You are a Virtual Help Desk AI Assistant.

# RULES:
# - Use ONLY context
# - If context is sufficient → answer from it
# - If partial → infer carefully
# - If not enough → say I don’t have this information in the current documents. You can switch to internet search, and I’ll find the latest details for you.

# Return ONLY JSON:
# {{
#   "answer": "...",
#   "found_in_context": true
# }}
# """),
#         ("human", "Context:\n{context}\n\nQuestion:\n{question}")
#     ])
    prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a Virtual Help Desk AI Assistant for a university system.

IMPORTANT RULES:
- Use ONLY the provided context
- Do NOT use outside knowledge
- Do NOT hallucinate missing data
- If information is not in context → clearly say it is not available
- Keep answer natural and helpful
- If query refers to a role (e.g. teacher assistant, HOD, lecturer),
  extract the exact matching person(s) from context.
- Return FULL NAME from context (basicInfo.fullName).
- Never replace with generic description.
-----------------------------------
TASK 1: ANSWER GENERATION
-----------------------------------
- Answer user query based on context
- If partial info exists, answer only what is available

-----------------------------------
TASK 2: STRUCTURED EXTRACTION
-----------------------------------
From the same context, also extract:

1. officeNodeId:
   - ONLY if faculty member exists in context
   - Take from:
     basicInfo.officeNodeId OR contact.officeNodeId
   - If not found → null

2. doorNodeId:
   - ONLY if navigation/room info exists in context
   - Take from metadata or room reference
   - If not found → null

3. publications_count:
   - Count number of publications if faculty has publications array
   - If not available → null
4. matched_person:
   - fullName of person if found in context
   - otherwise null
    - If multiple people match, choose ONLY the most relevant one
    - Do NOT mix information from different people
-----------------------------------
TASK 3: MEETING INTENT (NEW FEATURE)
-----------------------------------
Detect if user wants to:
- meet someone
- visit office
- find location

If YES → set:
"intent": "visit"
Else:
"intent": null

-----------------------------------
OUTPUT FORMAT (STRICT JSON ONLY):
{{
  "answer": "...",
  "found_in_context": true,
  "officeNodeId": null,
  "doorNodeId": null,
  "publications_count": null,
  "intent": null,
     "matched_person": null
}}
"""),
   ("human", """
Previous Conversation:
{chat_history}

Document Context:
{context}

Current User Question:
{question}
""")
])
    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0,
        api_key=api_key
    )

    chain = prompt | llm

    response = chain.invoke({
        "chat_history": formatted_history,
        "context": context,
        "question": query
    })

    # ---------------------------
    # Parse response
    # ---------------------------
    try:
        parsed = json.loads(response.content)
    except:
        parsed = {
            "answer": response.content,
            "found_in_context": True
        }

    parsed.setdefault("found_in_context", True)
    parsed["needs_internet"] = not parsed["found_in_context"]

    # ---------------------------
    # Add metadata to response
    # ---------------------------
    matched_person = parsed.get("matched_person")

    office_node_id, door_node_id = extract_navigation_info(
        docs,
        matched_person=matched_person
    )

    parsed["officeNodeId"] = parsed.get("officeNodeId") or office_node_id
    parsed["doorNodeId"] = parsed.get("doorNodeId") or door_node_id
    parsed["publications_count"] = (
        parsed.get("publications_count")
        or publications_count
    )
    # ---------------------------
    # Sources
    # ---------------------------
    sources = list(set([
        d.metadata.get("source", "Unknown") for d in docs
    ]))

    return {
        "answer": parsed,
        "sources": sources
    }