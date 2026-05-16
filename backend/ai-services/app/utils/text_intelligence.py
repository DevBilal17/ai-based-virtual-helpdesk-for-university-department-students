import ftfy
import unicodedata
from unidecode import unidecode
from rapidfuzz import fuzz, process
from pyphonetics import Metaphone


# Initialize phonetic engine once (IMPORTANT for performance)
metaphone = Metaphone()


# =========================
# 1. BASIC TEXT NORMALIZER
# =========================
def normalize_text(text: str) -> str:
    """
    Cleans raw text:
    - fixes encoding issues
    - removes unicode noise
    - converts to ascii
    - lowercases
    """
    if not text:
        return ""

    text = ftfy.fix_text(text)
    text = unicodedata.normalize("NFKD", text)
    text = unidecode(text)
    text = text.lower().strip()

    return text


# =========================
# 2. PHONETIC ENCODING
# =========================
def phonetic_encode(text: str) -> str:
    """
    Converts words into phonetic representation
    Helps match:
    Ahmad ≈ Ahmed ≈ Ahmat
    """
    try:
        return metaphone.phonetics(text)
    except:
        return text


# =========================
# 3. FUZZY MATCH SCORE
# =========================
def fuzzy_score(a: str, b: str) -> int:
    """
    Returns similarity score between two strings
    """
    return fuzz.ratio(a, b)


# =========================
# 4. SMART QUERY NORMALIZER
# =========================
def smart_normalize_query(query: str) -> dict:
    """
    Returns enhanced query object with multiple layers:
    - cleaned text
    - phonetic form
    """
    cleaned = normalize_text(query)
    phonetic = phonetic_encode(cleaned)

    return {
        "original": query,
        "cleaned": cleaned,
        "phonetic": phonetic
    }


# =========================
# 5. BEST MATCH FINDER (FOR RETRIEVAL)
# =========================
def find_best_matches(query: str, documents: list, top_k: int = 5):
    """
    Hybrid fuzzy + semantic fallback matcher
    Works even if embeddings fail.
    """

    query_clean = normalize_text(query)

    scored_results = []

    for doc in documents:
        doc_text = normalize_text(doc)

        score = fuzzy_score(query_clean, doc_text)

        scored_results.append({
            "text": doc,
            "score": score
        })

    # sort by best match
    scored_results.sort(key=lambda x: x["score"], reverse=True)

    return scored_results[:top_k]


# =========================
# 6. PHONETIC MATCH CHECK
# =========================
def phonetic_match(a: str, b: str) -> bool:
    """
    Checks if two words sound similar
    """
    return phonetic_encode(a) == phonetic_encode(b)