import * as React from "react";
import {Container} from "react-bootstrap";
import styles from "./DocBlock.module.css";
import Image from "next/image";

interface Props {
    name: string;
    pageID: string;
    documentName: string; // document
}

export function DocBlock(props: Props){
    return(
        <>
        <a href={"/documents/" + props.pageID + "?document_name=" + props.documentName}>
        <Container className={styles.docBlock}>
            <Image src="/atmega.png" alt="atmega thumbnail image" height='200' width='130' 
                className={styles.thumbnail}/>
            <div className={styles.description}>{props.name}</div>
        </Container>
        </a>
        </>
    );
}

// export function DocBlock(props: Props) {
//   return (
//     <>
//       <a href={"/search/" + "/?document_name=" + props.documentName}>
//         <Container className={styles.docBlock}>
//           <img src="atmega.png" className={styles.thumbnail} />
//           <div className={styles.description}>{props.name}</div>
//         </Container>
//       </a>
//     </>
//   );
// }