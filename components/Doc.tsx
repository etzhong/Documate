import React from "react";
import ReactDOM from "react-dom";
import { GetServerSideProps } from 'next';
import {connectToDatabase} from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {SidebarHeader} from "@/components/SidebarHeader"
import styles from "./Doc.module.css";

//Props
interface DocProps {
    title: string;
    documentName: string;
    headers: string[];
    bodies: string[];
}

//Other Function Declarations



export function Doc (props: DocProps) {
    let headers = props.headers;
    let bodies = props.bodies;

    //Function for Dynamically Generating Contents
    const listSidebarHeaders = [];
    const listContent = [];
    for(let i=0; i<headers.length; i++){
        listSidebarHeaders.push(
            <a href={"#link-"+i} style={{textDecoration: 'none', scrollBehavior: 'smooth'}}>
                <SidebarHeader header={headers[i]}/>
            </a>
        );
        listContent.push(
            <>
            <h1 id={"link-"+i} className={styles.header}>{headers[i]}</h1>
            <p id={"link-"+i} className={styles.body}>{bodies[i]}</p>
            </>
        );
    }

    return(
        <>
        <div className={styles.container}>
            <div className={styles.sidebar}>
                {listSidebarHeaders}
            </div>
            <div className={styles.content}>
                {listContent}
            </div>
        </div>
        <div className={styles.chat}>
          <Chat documentName={props.documentName} />
        </div>
        </>
    );

}