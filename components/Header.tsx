import * as React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export function Header(){
    
    return (
        <>
        <div className={styles.header}>
            <Link href="/" >
                <img src="../logo.svg" alt=":Documate Logo" className={styles.logo}/>
            </Link>
            <Link className={styles.dashboardLink} href="/dashboard">
                <strong>DEMO</strong>
            </Link>
        </div>
        </>
    );
}