import * as React from "react";
import { useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Typewriter from 'typewriter-effect';

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
    } else {
      // Invalid email
      alert("Please enter a valid email address");
    }
  };

  return (
    <>
    <div className="landing">
      <div className="frame-2">
        <img className="logo" src={"logo.svg"} />
        <span className="login">LOGIN</span>
      </div>
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
        Understanding and searching through hardware docs is hard.<br />
        Let’s automate that process with :Documate.
      </span>
      
      <Form onSubmit={handleSubmit} className="frame">
        <Form.Group controlId="formBasicEmail">
          <Form.Control className="email-form" 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <div className="frame-1">
          <Button type="submit" className="request-access">
            Request Access
          </Button>
        </div>
      </Form>
    </div>
    </>
  );
};

export default App;