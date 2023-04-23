import * as React from "react";
import styles from "./Header.module.css";

export function Header(){
    return (
        <>
        <div className={styles.header}>
            <a href="/">
                <img className={styles.logo} src={"../logo.svg"}/>
            </a>
            <a className={styles.dashboardLink} href="/dashboard">
                <strong>DASHBOARD</strong>
            </a>
        </div>
        <p className={styles.space}/>
        <hr className={styles.line}/>
        </>
    );
}