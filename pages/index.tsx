import * as React from "react";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Typewriter from 'typewriter-effect';
import {Header} from "./components/Header";

const App = () => {
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      // Success
      setShowAlert(true);
      setEmail("");
      setTimeout(() => {
        setShowAlert(false);
      }, 5000); // hide the alert after 5 seconds
    } else {
      // Invalid email
      alert("Please enter a valid email address");
    }
  };

  return (
    <>
    <Header/>
    <p style={{'margin-bottom': '240px'}}></p>
    <div className="landing">
      <span className="simplify-hardware-documentation">
        <Typewriter
          onInit={(typewriter) =>{
          typewriter
            .typeString("Simplify hardware<br /><s style='color: #aaa'>documentation</s> docs.</span>")
            .start();
          }}
        />
      </span>
      <span className="understanding-and-searching-thro">
        Understanding and searching through hardware docs is hard<br />
        Let’s automate that process with <b>:Documate</b>.
      </span>
      
      <Form onSubmit={handleSubmit} className="frame">
        <Form.Group controlId="formBasicEmail">
          <Form.Control className="email-form" 
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>
        <div className="frame-1">
          <Button type="submit" className="request-access">
            Request Access
          </Button>
        </div>
      </Form>
        
      <Alert
        className="alert alert-primary"
        role="alert"
        show={showAlert}
        onClose={() => setShowAlert(false)}
        dismissible
        variant="success"
      >
        You have been added to the waitlist!
      </Alert>
      
    </div>
    </>
  );
};

export default App;