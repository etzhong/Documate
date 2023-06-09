import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Doc} from "@/components/Doc";
import { GetServerSidePropsContext } from 'next';
import { connectToDatabase } from '../../lib/db';


export default function displayDocument({ document_name, headers, bodies, chatName}: { document_name: string, headers: string[], bodies: string[], chatName: string}) {
    return ( 
        <>
        <Doc title="displayDocument" documentName={document_name} headers={headers} bodies={bodies} chatName={chatName} />

        </>

    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the id query parameter from the context
  const document_name = context.query.document_name as string;
  const chatName = context.query.chatName as string;

  const res = await connectToDatabase(document_name);
  // Fetch data from your database using the `db` object.
  // For example, you can fetch the headers and bodies like this:
  const headers = res[0];
  const bodies = res[1];

  return {
    props: {
      headers,
      bodies,
      document_name,
      chatName
    },
  };
}