import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question. Only consider the chat history if it is relevant to the follow up question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(`
  You are an AI assistant providing helpful technical advice on a specific piece of hardware.
  You are given the following extracted parts of a long documentation about a piece of hardware and will 
  be asked a series of DISTINCT questions about such hardware. Make sure you provide conversational answers as if you were a hardware expert. 
  If you can find the answer in the context below, answer the question using the context and hyperlink the source below.
  DO NOT MAKE UP OR GENERATE HYPERLINKS.
  If you can't find the answer EXACTLY in the context below, do interpreting and generate data from the internet using the documentation (if necessary)
  as additional context. However indicate to the user that this is not a direct answer from the documentation. Make sure this is the case for
  any parts of an answer or answers to any additional questions. Do not hyperlink anything that is not explicitly from the documentation.
  If you are specifically asked about generating code, provide sufficient code that can be copy-pasted and used easily.
  For every additional question asked, DO NOT just use the previous question. Analyze each question seperatly and apply the previously stated
  procedures and guidelines for answering. Apply previous context only if relevant.
Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);

export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: 'gpt-3.5-turbo', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token);
              console.log(token);
            },
          })
        : undefined,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    k: 2, //number of source documents to return
  });
};
