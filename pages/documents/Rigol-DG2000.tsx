import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {Doc} from "@/components/Doc";
import { GetServerSidePropsContext } from 'next';
import { connectToDatabase } from '../../lib/db';


export default function rigolDG2000({ document_name, headers, bodies}: { document_name: string, headers: string[], bodies: string[] }) {
    return ( 
        <>
        <Header/>
        <Doc title="Rigol DG2000" documentName={document_name} headers={headers} bodies={bodies} />
        <h1>{document_name}</h1>
        


        </>

    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the id query parameter from the context
  const document_name = context.query.document_name as string;

  const res = await connectToDatabase(document_name);
  // Fetch data from your database using the `db` object.
  // For example, you can fetch the headers and bodies like this:
  const headers = res[0];
  const bodies = res[1];

  return {
    props: {
      headers,
      bodies,
      document_name
    },
  };
}