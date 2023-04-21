import * as React from "react";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./dashboard.module.css";
import {Header} from "./components/Header";

const Dashboard = () => {
  
  return (
    <> 
    <Header/>
    <p className={styles.space}/>
    <div className={styles.div1}>
      <h1 className={styles.myDocuments}>My Documents</h1>
      <Button variant="primary" className={styles.uploadButton}>Upload</Button>
    </div>
    </>
  );
};

export default Dashboard;