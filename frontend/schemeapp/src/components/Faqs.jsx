import React from "react";
import { Container, Accordion } from "react-bootstrap";
import NavbarComponent from "./Navbar";

const FAQs = () => {
  return (
    <>
    <NavbarComponent/>
    
    <Container className="py-5">
      <h2 className="text-center mb-4 text-primary">Frequently Asked Questions</h2>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is Schemease?</Accordion.Header>
          <Accordion.Body>
            Schemease is a platform that helps citizens find, understand, and apply for various government and private schemes in India.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Is Schemease free to use?</Accordion.Header>
          <Accordion.Body>
            Yes, Schemease is completely free for users who wish to browse and access scheme information.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How often is the data updated?</Accordion.Header>
          <Accordion.Body>
            We update our database regularly to ensure that all information is accurate and relevant.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Can I apply for schemes directly through Schemease?</Accordion.Header>
          <Accordion.Body>
            Yes, in most cases, we provide a direct application process or a link to the official application portal.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
    </>
  );
};

export default FAQs;
