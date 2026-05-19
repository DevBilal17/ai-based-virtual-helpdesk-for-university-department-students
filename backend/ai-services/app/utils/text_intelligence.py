import ftfy
import unicodedata
from unidecode import unidecode
from rapidfuzz import fuzz, process
from pyphonetics import Metaphone


# Initialize phonetic engine once (IMPORTANT for performance)
metaphone = Metaphone()

TEACHER_ALIASES = {
    "mariam rehman": [
        "mariam",
        "maryam",
        "maryaam",
        "mariyam",
        "maryum",
        "meryam",
        "mariam rehman",
        "maryam rehman",
        "mariam rehmaan",
        "maryam rehmaan",
        "prof mariam",
        "prof maryam",
        "dr mariam",
        "dr maryam",
        "doctor mariam",
        "doctor maryam",
        "sir mariam",
        "mam mariam",
        "mam maryam",
        "chairperson mariam",
        "hod mariam",
    ],

    "rabia saleem": [
        "rabia",
        "rabiya",
        "rabeya",
        "rabia saleem",
        "rabiya saleem",
        "dr rabia",
        "doctor rabia",
        "mam rabia",
        "miss rabia",
    ],

    "muhammad younas": [
        "younas",
        "yunus",
        "yunas",
        "younis",
        "yonas",
        "yunas",
        "muhammad younas",
        "muhammad yunus",
        "mohammad younas",
        "sir younas",
        "sir yunus",
        "dr younas",
        "dr yunus",
        "doctor younas",
        "doctor yunus",
    ],

    "tahir abdullah": [
        "tahir",
        "tahir abdullah",
        "tahir abdula",
        "tahir abdulla",
        "sir tahir",
        "dr tahir",
    ],

    "afzaal hussain": [
        "afzal",
        "afzaal",
        "afzaaal",
        "afzaal hussain",
        "afzal hussain",
        "sir afzal",
        "sir afzaal",
        "dr afzal",
        "dr afzaal",
        "doctor afzaal",
    ],

    "shahbaz nazeer": [
        "shahbaz",
        "shahbaaz",
        "shehbaz",
        "shahbaz nazeer",
        "shehbaz nazeer",
        "sir shahbaz",
        "sir shehbaz",
        "dr shahbaz",
    ],

    "farhan shafqat": [
        "farhan",
        "farhan shafqat",
        "farhan shafat",
        "farhan shafaqat",
        "sir farhan",
        "mr farhan",
    ],
}
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
    Enhanced query normalization pipeline
    """

    cleaned = normalize_text(query)

    # teacher/entity normalization
    cleaned = normalize_teacher_entities(cleaned)

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


def normalize_teacher_entities(text: str) -> str:
    """
    Replace teacher aliases with canonical names
    """

    text = normalize_text(text)

    for canonical_name, aliases in TEACHER_ALIASES.items():

        all_aliases = aliases + [canonical_name]

        for alias in all_aliases:

            alias_clean = normalize_text(alias)

            # exact containment
            if alias_clean in text:
                text = text.replace(alias_clean, canonical_name)

            # phonetic fallback
            elif phonetic_match(alias_clean, text):
                text = canonical_name

    return text