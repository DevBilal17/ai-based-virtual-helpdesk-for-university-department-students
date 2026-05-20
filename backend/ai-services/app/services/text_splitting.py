from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_text(content, chunk_size=600, chunk_overlap=150):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )

    return text_splitter.split_documents(content)