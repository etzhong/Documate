import React from "react";
import ReactDOM from "react-dom";
import { GetServerSideProps } from 'next';
import {connectToDatabase} from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {SidebarHeader} from "@/components/SidebarHeader"
import styles from "./Doc.module.css";
import { useState } from "react";


//Props
interface DocProps {
    title: string;
    documentName: string;
    headers: string[];
    bodies: string[];
    chatName: string;
}

export function Doc (props: DocProps) {
    let headers = props.headers;
    let bodies = props.bodies;
    const [selectedBody, setSelectedBody] = useState(bodies[0]);

    const handleHeaderClick = (index: number) => {
      setSelectedBody(bodies[index]);
    };

    //Function for Dynamically Generating Contents
    const listSidebarHeaders = [];
    const listContent = [];
    for(let i=0; i<headers.length; i++){
        listSidebarHeaders.push(
            <a href={"#link-"+i} style={{textDecoration: 'none', scrollBehavior: 'smooth'}} 
              onClick={() => handleHeaderClick(i)}
            >
                <SidebarHeader header={headers[i]}/>
            </a>
        );
        if (i == 0) {
          listContent.push(
              <>
              <h1 id={"link-"+i} className={styles.header}>{headers[i]}</h1>
              <p
                id={"link-" + i}
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: bodies[i] }}
              ></p>
              </>
          );
        }
    }

    return(
        <>
        <div className={styles.container}>
            <div className={styles.sidebar}>
                {listSidebarHeaders}
            </div>
            <div className={styles.content} 
                dangerouslySetInnerHTML={{ __html: selectedBody }}
            >
            </div>
        </div>
        <div className={styles.chat}>
          <Chat documentName={props.documentName} chatName={props.chatName} />
        </div>
        </>
    );

}