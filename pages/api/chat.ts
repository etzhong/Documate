import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { chunkArray } from 'langchain/dist/util';
import { OpenAI } from 'langchain';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  const index = pinecone.Index(PINECONE_INDEX_NAME);

  /* create vectorstore*/
  const vectorStore = await PineconeStore.fromExistingIndex(
    index,
    new OpenAIEmbeddings({}),
    'text',
    PINECONE_NAME_SPACE, //optional
  );

  // console.log("Before");
  // try {
  // const search_res = await vectorStore.similaritySearch("What are wave forms", 4);
  // console.log("Search Results ----------------------------");
  // for (let i = 0; i < search_res.length; ++i) {
  //   console.log(search_res[i].pageContent);
  //   console.log(search_res[i].metadata);
  // }
  // console.log("-------------------------------------------");
  // } catch (error) {
  //   console.log('error', error);
  // }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  sendData(JSON.stringify({ data: '' }));

  //create chain
  const chain = makeChain(vectorStore, (token: string) => {
    sendData(JSON.stringify({ data: token }));
  });

  try {
    //Ask a question
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });
    console.log("RESPONSE--------------------------------")
    console.log(response)

    sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }));
  } catch (error) {
    console.log("Error----------------------");
    console.log('error', error);
  } finally {
    sendData('[DONE]');
    res.end();
  }
}