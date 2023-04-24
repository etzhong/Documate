import * as React from "react";
import {Container} from "react-bootstrap";
import Image from "next/image";
import styles from "./SidebarHeader.module.css";


interface HeaderProps {
    header: string;
}

export function SidebarHeader(props: HeaderProps) {
    return (
        <>
        <div className={styles.headerBlock}>
            <div className={styles.container}>
                <img src={"/vector1.svg"} className={styles.vector}/>
                <p className={styles.headerText}> {props.header}</p>
            </div>
        </div>
        </>
    );
}