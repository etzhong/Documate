import React from "react";
import ReactDOM from "react-dom";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import { connectToDatabase } from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import { Chat } from "@/components/Chat";
import { SidebarHeader } from "@/components/SidebarHeader"
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



export function Doc(props: DocProps) {
  let headers = props.headers;
  let bodies = props.bodies;
  const [selectedBody, setSelectedBody] = useState(bodies[0]);
  const [searchResults, setSearchResults] = useState<any[]>([]);


  const clearSearchResults = () => {
    setSearchResults([]);
  };

  const handleHeaderClick = (index: number) => {
    setSelectedBody(bodies[index]);
  };

  function wrapText(text: string, maxLineLength: number) {
    let newText = text.replace(/(\r\n|\n|\r)/gm, " ")
    console.log("Text:" + newText);
    const words = newText.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      if (currentLine.length + word.length + 1 <= maxLineLength) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.join('\n');
  }


  const renderSearchResults = () => {
    if (searchResults.length === 0) return null;

    return (
      <div className={styles.searchResults}>
        {searchResults.map((result, index) => (
          <div
            key={index}
            className={styles.searchResult}
            onClick={() => handleResultClick()}
          >
            <div className={styles.searchResultContent}>
              
              <strong>Source {index}</strong>
              <br></br>
              {wrapText(result.pageContent, 70).split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <br></br>
              {"Page Number: " + result.metadata['page_number']}
              <br></br>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      clearSearchResults();
    }
  };

  //Function for Dynamically Generating Contents
  const listSidebarHeaders = [];
  const listContent = [];
  for (let i = 0; i < headers.length; i++) {
    listSidebarHeaders.push(
      <Link href={"#link-" + i} style={{ textDecoration: 'none', scrollBehavior: 'smooth' }}
        onClick={() => handleHeaderClick(i)}
      >
        <SidebarHeader header={headers[i]} />
      </Link>
    );
    if (i == 0) {
      listContent.push(
        <>
          <h1 id={"link-" + i} className={styles.sideHeader}>{headers[i]}</h1>
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

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: searchQuery,
          chatName: props.chatName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Search received-------------------------");
        console.log(responseData);
        setSearchResults(responseData);
      } else {
        console.error('Search API request failed:', response.statusText);
      }
    } catch (error) {
      console.error('Search API request error:', error);
    }
  };

  const handleResultClick = () => {
    setSearchQuery("");
    clearSearchResults();
  };

  return (
    <>
      <div className={styles.header}>
        <Link href="/" >
          <img src="../logo.svg" alt=":Documate Logo" className={styles.logo} />
        </Link>
        <div className={styles.rightHeaderDiv}>
          <form onSubmit={handleSearch}>
            <div className={styles.searchBarContainer}>
              <input type="image" src="../searchIcon.svg" className={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className={styles.searchBar}
              />
              {renderSearchResults()}
            </div>
          </form>
          <Link className={styles.dashboardLink} href="/dashboard">
            <img src="../userIcon.svg" className={styles.userIcon} />
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