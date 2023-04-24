import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {Doc} from "@/components/Doc";

export default function rigolDG2000() {
    return ( 
        <>
        <Header/>
        <Doc/>
        <h1>You have reached the Rigol Page!</h1>
        <Chat/>
        </>

    );
}