import * as React from "react";
import { GetServerSideProps } from 'next';
import {connectToDatabase} from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";

export function Doc() {
    //Hard-Coded Data. Change Later
    const headers = ["Header A", "Header B", "Header C", "Header D", "Header E", "Header F"];
    const bodies = ["Body A", "Body B", "Body C", "Body D", "Body E", "Body F"];

    return(
        <>
        <h1>Doc Component</h1>
        </>
    );

}