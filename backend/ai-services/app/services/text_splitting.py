from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_text(content, chunk_size=600, chunk_overlap=150):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, 
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", ""] # Smart splitting order
    )
    
    # Check if content is a list of Documents or just a string
    if isinstance(content, list):
        # This keeps your metadata (like filename) attached to every chunk!
        chunks = text_splitter.split_documents(content)
    else:
        chunks = text_splitter.split_text(content)
        
    return chunks