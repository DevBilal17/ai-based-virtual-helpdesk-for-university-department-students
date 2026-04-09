from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_text(text, chunk_size=400, chunk_overlap=100):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_text(text)
    return chunks