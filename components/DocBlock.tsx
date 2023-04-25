import * as React from "react";
import {Container} from "react-bootstrap";
import styles from "./DocBlock.module.css";
import Image from "next/image";
import Link from "next/link";

interface Props {
    name: string;
    pageID: string;
    documentName: string; // document
    image: string;
    chatName: string;
}

export function DocBlock(props: Props){
    return(
        <>
        <Link href={"/documents/" + props.pageID + "?document_name=" + props.documentName + "&chatName=" + props.chatName}
            className={styles.anchor}>
        <Container className={styles.docBlock}>
            <Image src={props.image} alt="atmega thumbnail image" height='200' width='130' 
                className={styles.thumbnail}/>
            <span className={styles.description}>{props.name}</span>
        </Container>
        </Link>
        </>
    );
}
