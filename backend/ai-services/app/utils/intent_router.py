from sentence_transformers import SentenceTransformer
import numpy as np

# Load once (FAST)
model = SentenceTransformer("all-MiniLM-L6-v2")

# =========================
# INTENT TEMPLATES
# =========================

INTENTS = {
    "greeting": [
        "hello",
        "hi",
        "hey",
        "how are you",
        "good morning",
        "good evening"
    ],

    "developer": [
    "who developed this system",
    "who developed you",
    "who made you",
    "who created you",
    "who built you",
    "system developer",
    "project creators",
    "creator of this assistant",
    "who is your developer"
],

    "internet": [
        "search on internet",
        "latest news",
        "google this",
        "external information"
    ]
}


# =========================
# EMBEDDINGS CACHE
# =========================
intent_embeddings = {}

for key, values in INTENTS.items():
    embeddings = model.encode(values)
    intent_embeddings[key] = np.mean(embeddings, axis=0)


# =========================
# COSINE SIMILARITY
# =========================
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# =========================
# MAIN ROUTER
# =========================
def detect_intent(query: str):
    query = query.lower().strip()
    query_emb = model.encode(query)

    best_intent = "rag"
    best_score = 0.55  

    for intent, intent_emb in intent_embeddings.items():
        score = cosine_sim(query_emb, intent_emb)

        if score > best_score:
            best_score = score
            best_intent = intent
    print("Intent:", best_intent, "Score:", best_score)
    return best_intent
   