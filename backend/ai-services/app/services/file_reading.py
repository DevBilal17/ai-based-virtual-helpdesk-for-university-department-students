import os

from pypdf import PdfReader
from docx import Document
import pandas as pd
# from langchain_mistralai import ChatMistralAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
# from langchain_huggingface import HuggingFaceEmbeddings


# Read PDF
def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


# Read .docx
def extract_text_from_docx(file_path):
    docx = Document(file_path)
    text = ""
    for para in docx.paragraphs:
        para_text = para.text
        if para_text:
            text += para_text + "\n"
    return text


# Read Excel
def extract_text_from_excel(file_path):
    df = pd.read_excel(file_path)
    text = ""
    text = df.to_string()
    return text

# Read CSV
def extract_text_from_csv(file_path):
    df = pd.read_csv(file_path)
    text = ""
    text = df.to_string()
    return text

#Read .txt
def extract_text_from_txt(file_path):
    file = TextLoader(file_path, encoding='utf-8')
    text = file.load()
    return text


# Read File
def read_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        print("Reading PDF file:", extract_text_from_pdf(file_path))
        return extract_text_from_pdf(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    elif ext in [".xlsx",".xls"]:
        return extract_text_from_excel(file_path)
    elif ext == '.csv':
        return extract_text_from_csv(file_path)
    elif ext == '.txt':
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    
