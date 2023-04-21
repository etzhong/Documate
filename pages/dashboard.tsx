import * as React from "react";
import { useState } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./dashboard.module.css";
import {Header} from "./components/Header";
import {DocBlock} from "./components/DocBlock";

const Dashboard = () => {
  
  return (
    <> 
    <Header/>
    <p className={styles.space}/>
    <div className={styles.div1}>
      <h1 className={styles.myDocuments}>My Documents</h1>
      <Button variant="primary btn-lg" className={styles.uploadButton}>Upload</Button>
    </div>
    <p className={styles.space}/>
    <div className={styles.gridContainer}>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
      <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000"/>
    </div>

    </>
  );
};

export default Dashboard;