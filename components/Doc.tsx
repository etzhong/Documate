import React from "react";
import ReactDOM from "react-dom";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import {connectToDatabase} from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import {Chat} from "@/components/Chat";
import {SidebarHeader} from "@/components/SidebarHeader"
import styles from "./Doc.module.css";
import { useState, FormEvent } from "react";

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
            <Link href={"#link-"+i} style={{textDecoration: 'none', scrollBehavior: 'smooth'}} 
              onClick={() => handleHeaderClick(i)}
            >
                <SidebarHeader header={headers[i]}/>
            </Link>
        );
        if (i == 0) {
          listContent.push(
              <>
              <h1 id={"link-"+i} className={styles.sideHeader}>{headers[i]}</h1>
              <p
                id={"link-" + i}
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: bodies[i] }}
              ></p>
              </>
          );
        }
    }

    //Search declarations and functions
    const [searchQuery, setSearchQuery] = useState<string>('');
    const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      console.log('Search Query:', searchQuery);//Replace this Steve with some function to update page content
    };

    return(
        <>
        <div className={styles.header}>
          <Link href="/" >
            <img src="../logo.svg" alt=":Documate Logo" className={styles.logo}/>
          </Link>
          <div className={styles.rightHeaderDiv}>
            <form onSubmit={handleSearch}>
              <div className={styles.searchBarContainer}>
                <input type="image" src="../searchIcon.svg" className={styles.searchIcon}/>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search"
                  className={styles.searchBar} 
                />
              </div>
            </form>
            <Link className={styles.dashboardLink} href="/dashboard">
              <img src="../userIcon.svg" className={styles.userIcon}/>
            </Link>
          </div>
        </div>


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