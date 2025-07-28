import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">SchemeEase</h5>
            <p>Your one-stop portal for finding and applying to the right government schemes.</p>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="/faq" className="text-light text-decoration-none">FAQs</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6>Contact</h6>
            <p>Email: support@schemeease.in</p>
            <p>Phone: +91 98765 43210</p>
          </Col>
        </Row>
        <hr className="border-light" />
        <p className="text-center mb-0">© {new Date().getFullYear()} SchemeEase. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;
