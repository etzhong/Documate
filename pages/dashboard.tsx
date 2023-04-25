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
        <DocBlock name="Rigol DG2000 Arbitrary Waveform Generator" pageID="displayDocument" documentName="Rigol2.pdf" image="/Rigol.png" />
        <DocBlock name="FPGA" pageID="displayDocument" documentName="FPGA2.pdf" image="/FPGA.png" />
        <DocBlock name="Guitar" pageID="displayDocument" documentName="Guitar2.pdf" image="/Guitar.png" />
        <DocBlock name="McDonalds Ice Cream Machine" pageID="displayDocument" documentName="McDonalds2.pdf" image="/McDonalds.png" />
        <DocBlock name="LG Washing Machine" pageID="displayDocument" documentName="WashingManual2.pdf" image="/WashingManual.png" />
        <DocBlock name="Oscilloscope" pageID="displayDocument" documentName="Oscilloscope2.pdf" image="/Oscilloscope.png" />
        <DocBlock name="Atmega328P" pageID="displayDocument" documentName="Atmega328P.pdf" image="/atmega.png" />
      </div>

    </>
  );
};

export default Dashboard;