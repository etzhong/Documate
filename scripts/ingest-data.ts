import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader, TextLoader } from 'langchain/document_loaders';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import CustomPDFLoader from "../lib/CustomPDFLoader";
import * as path from 'path';


// put different documents into different namespaces
// store firebase data on the namespaces
// Test semantic search
// TODO add page numbers to sources

/* Name of directory to retrieve files from. You can change this as required */
const filePath = '../docs/Oscilloscope.pdf';

export const run = async () => {
  try {
    /*load raw docs from the pdf file in the directory */
    // const loader = new TextLoader(filePath);
    // const loader = new PDFLoader(filePath);
    
    console.log("RawDocs---------------------------------------")
    const myLoader = new CustomPDFLoader(filePath);
    const rawDocs = await myLoader.loadAndSplit();
    console.log(rawDocs[0]);
    return;
    // console.log(rawDocs);
    // return;
    // console.log(rawDocs);

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // const docs = await textSplitter.splitDocuments(rawDocs);
    // const docs = rawDocs;
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    // grab each page and map chunk -> page

    // on sources return, output the image of the page
    let myMap = new Map<string, number>();

    /* Pinecone recommends a limit of 100 vectors per upsert request to avoid errors*/
    const chunkSize = 50;
    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      console.log('chunk', i, chunk);
      return;
      await PineconeStore.fromDocuments(
        index,
        chunk,
        embeddings,
        'text',
        PINECONE_NAME_SPACE,
      );
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();




// database
// add query to user

