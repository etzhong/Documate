import * as React from "react";
import {Container} from "react-bootstrap";
import styles from "./DocBlock.module.css";

interface Props {
    name: string;
    pageID: string;
}

export function DocBlock(props: Props){
    return(
        <>
        <a href={"/documents/" + props.pageID}>
        <Container className={styles.docBlock}>
            <img src="atmega.png" className={styles.thumbnail}/>
            <div className={styles.description}>{props.name}</div>
        </Container>
        </a>
        </>
    );
}
