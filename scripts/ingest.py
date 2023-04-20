from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.schema import Document
import pinecone
import os


import PyPDF2


class PyPDFLoader:
    def __init__(self, file_path):
        self.file_path = file_path

    def load_and_split(self):
        with open(self.file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            pages = []
            for i in range(num_pages):
                page = pdf_reader.pages[i]
                content = page.extract_text()
                data = {
                  'page_number': i + 1,
                  'total_pages': num_pages,
                }
                doc = Document(page_content=content, metadata=data)
                pages.append(doc)

        return pages


def ingest_docs(filename):
    loader = PyPDFLoader(filename)
    raw_documents = loader.load_and_split()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    documents = text_splitter.split_documents(raw_documents)
    embeddings = OpenAIEmbeddings()
    pinecone.init(
        api_key=os.environ['PINECONE_API_KEY'],
        environment=os.environ['PINECONE_ENVIRONMENT']
    )
    index_name = 'lavalab'
    chunkSize = 50
    for i in range(0,len(documents), chunkSize):
      chunk = documents[i:i+chunkSize]
      # print(chunk)
      print("TYPE--------------------------------------")
      print(type(chunk))
      docsearch = Pinecone.from_documents(
          chunk, embeddings, index_name=index_name,
          textKey='page_content',
          namespace=filename)

    print("Data uploaded-----------------------")
    # print(docsearch)


ingest_docs('../docs/Rigol.pdf')

# Namespaces
# ../docs/Oscilloscope.pdf