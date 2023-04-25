import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, chatName } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  const index = pinecone.Index(PINECONE_INDEX_NAME);

  let namespace = "../docs/" + chatName;
  console.log("Question: " + question);
  console.log("namespace: " + namespace);
  /* create vectorstore*/
  const vectorStore = await PineconeStore.fromExistingIndex(
    index,
    new OpenAIEmbeddings({}),
    'text',
    namespace,
  );

  res.setHeader('Content-Type', 'application/json');
  try {
    const search_res = await vectorStore.similaritySearch(question, 2);
    console.log("Search Results ----------------------------");
    for (let i = 0; i < search_res.length; ++i) {
      console.log(search_res[i].pageContent);
      console.log(search_res[i].metadata);
    }
    console.log("-------------------------------------------");
    res.status(200).json(search_res);
  } catch (error) {
    console.log('error', error);
  }
}