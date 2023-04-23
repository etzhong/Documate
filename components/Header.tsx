import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export function Header(){
    
    return (
        <>
        <div className={styles.header}>
            <Link href="/" >
                <Image src="../logo.svg" alt=":Documate Logo" width="250" height="0" className={styles.logo}/>
            </Link>
            <Link className={styles.dashboardLink} href="/dashboard">
                <strong>DASHBOARD</strong>
            </Link>
        </div>
        <p className={styles.space}/>
        <hr className={styles.line}/>
        </>
    );
}