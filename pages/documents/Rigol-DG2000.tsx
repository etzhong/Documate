import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {Doc} from "@/components/Doc";
import { GetServerSidePropsContext } from 'next';


export default function rigolDG2000({ document_name }: { document_name: string }) {
    return ( 
        <>
        <Header/>
        <Doc title="Rigol DG2000"/>
        <h1>{document_name}</h1>
        


        </>

    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the id query parameter from the context
  const name = context.query.name as string;

  // Pass the name to the Home component as a prop
  return { props: { name } };
}