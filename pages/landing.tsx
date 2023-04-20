import * as React from "react";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

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
    <div className="landing">
      <div className="frame-2">
        <img className="logo" src={"logo.svg"} />
        <span className="login">LOGIN</span>
      </div>
      <span className="simplify-hardware-documentation">
        Simplify hardware<br />
        <s>documentation</s> docs.
      </span>
      <span className="understanding-and-searching-thro">
        Understanding and searching through hardware docs is hard.<br />
        Let’s automate that process with Documate.
      </span>
      <Form onSubmit={handleSubmit} className="frame">
        <Form.Label className="your-email-address">Your email address</Form.Label>
        
        <div className="frame-1">
          <Button type="submit" className="request-access">
            Request access
          </Button>
        </div>
      </Form>
      <Alert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        dismissible
        variant="success"
        className="mt-4"
      >
        You have been successfully added to the waitlist!
      </Alert>
    </div>
  );
};

export default App;
