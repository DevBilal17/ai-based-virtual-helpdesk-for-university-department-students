from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain_mistralai import ChatMistralAI
from langchain.vectorstores import Chroma
import os


def ask_question(query):

    # 1. Load DB
    client = get_chroma_client()
    collection = get_or_create_collection(client)
    embedding_model = get_embedding_model()

    vectorstore = Chroma(
        client=client,
        collection_name=collection.name,
        embedding_function=embedding_model
    )

    # 2. Retriever (auto similarity search)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # 3. Prompt Template (system + human) - you can customize this as needed
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful AI assistant. Answer ONLY from the provided context."),
        ("human", "Context:\n{context}\n\nQuestion:\n{question}")
    ])

    # 4. LLM
    llm = ChatMistralAI(
        model_name="mistral-small-latest",
        api_key=os.getenv("MISTRAL_API_KEY")
    )

    # 5. Chain (LCEL style - latest 🔥)
    chain = (
        {
            "context": retriever,          # auto fetch context
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    # 6. Run
    result = chain.invoke(query)

    return result