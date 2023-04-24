import * as React from "react";
import { useState, useRef, LegacyRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { Header } from "@/components/Header";
import { DocBlock } from "@/components/DocBlock";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "@/styles/dashboard.module.css";

const Dashboard = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleModal = () => {
    setShowModal(!showModal);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; // no file selected
    if (file.type !== 'application/pdf') {// check that the file is a PDF
      alert('Please select a PDF file.');
      return;
    }
    setSelectedFile(file);
    setShowAlert(true);

    // handle file upload logic here (Empty for now)
    //Fill out primary "Upload" button for future function

    // reset state after upload
    setSelectedFile(null);
    setShowAlert(false);
  };

  return (
    <>
      <Header />
      <p className={styles.space} />
      <div className={styles.div1}>
        <h1 className={styles.myDocuments}>My Documents</h1>
        <Button variant="primary btn-lg" className={styles.uploadButton} onClick={handleModal}> Upload</Button>
      </div>
      <p className={styles.space} />

      <Modal class="modal-dialog modal-lg" show={showModal} onHide={handleModal} className={styles.uploadPromptBox}>
        <Modal.Body className={styles.uploadPromptBody}>
          <input type="file" ref={fileInputRef as LegacyRef<HTMLInputElement>} onChange={handleFileUpload} accept=".pdf" style={{ display: 'none' }} />
          <label htmlFor="upload" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            <img src="uploadBox.svg" />
          </label>
        </Modal.Body>
        <Modal.Footer className={styles.uploadPromptFooter}>
          <Button variant="secondary" onClick={handleModal}> Close </Button>
          <Button variant="primary" onClick={handleModal}> Upload </Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.gridContainer}>
        <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="Rigol-DG2000" documentName="Rigol.pdf" />
        <DocBlock name="FPGA" pageID="FPGA" documentName="FPGA.pdf" />
        <DocBlock name="Guitar" pageID="Guitar" documentName="Guitar.pdf" />
        <DocBlock name="McDonalds Ice Cream Machine" pageID="McDonalds" documentName="McDonalds.pdf" />
        <DocBlock name="LG Washing Machine" pageID="Washing" documentName="WashingManual.pdf" />
        <DocBlock name="Oscilloscope" pageID="Oscilloscope" documentName="Oscilloscope.pdf" />
        <DocBlock name="Atmega328P" pageID="Atmega" documentName="Atmega328P2.pdf" />
      </div>

    </>
  );
};

export default Dashboard;