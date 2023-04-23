import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/router"
import styles from "./Header.module.css";

export function Header(){

    const router = useRouter();
    function forceRefresh(){
        router.reload();
    }
    
    return (
        <>
        <div className={styles.header}>
            <Link href="/" onClick={forceRefresh}>
                <Image src="../logo.svg" alt=":Documate Logo" width="250" height="0" className={styles.logo}/>
            </Link>
            <Link className={styles.dashboardLink} href="/dashboard" onClick={forceRefresh}>
                <strong>DASHBOARD</strong>
            </Link>
        </div>
        <p className={styles.space}/>
        <hr className={styles.line}/>
        </>
    );
}