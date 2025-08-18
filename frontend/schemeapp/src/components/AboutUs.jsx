import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavbarComponent from "./Navbar";

const AboutUs = () => {
  return (
    <>
    <NavbarComponent/>
    <Container className="py-5">
      {/* Intro Section */}
      <h2 className="text-center mb-4 text-primary">About Schemease</h2>
      <p className="text-center text-muted mb-5">
        At Schemease, we make accessing government and private schemes easier, faster, and more transparent. 
        Our mission is to bridge the gap between opportunities and people who need them.
      </p>

      {/* Mission, Vision, Values */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-bullseye text-primary" style={{ fontSize: "2rem" }}></i>
              <h5 className="mt-3">Our Mission</h5>
              <p className="text-muted">
                Empower citizens by providing accurate and timely scheme information with a smooth application process.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-lightbulb text-primary" style={{ fontSize: "2rem" }}></i>
              <h5 className="mt-3">Our Vision</h5>
              <p className="text-muted">
                Create a one-stop platform for all schemes and benefits, accessible to every citizen in India.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-people text-primary" style={{ fontSize: "2rem" }}></i>
              <h5 className="mt-3">Our Values</h5>
              <p className="text-muted">
                Transparency, trust, and technology — the three pillars of Schemease’s commitment.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Roadmap / How it Works */}
      <h3 className="text-center text-primary mb-4">How Schemease Works</h3>
      <Row className="g-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 text-center p-3 h-100">
            <i className="bi bi-search text-primary" style={{ fontSize: "2rem" }}></i>
            <h6 className="mt-3 fw-bold">1. Discover</h6>
            <p className="text-muted">Browse verified schemes tailored to your profile.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 text-center p-3 h-100">
            <i className="bi bi-list-check text-primary" style={{ fontSize: "2rem" }}></i>
            <h6 className="mt-3 fw-bold">2. Check Eligibility</h6>
            <p className="text-muted">Review criteria to ensure you qualify for the scheme.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 text-center p-3 h-100">
            <i className="bi bi-upload text-primary" style={{ fontSize: "2rem" }}></i>
            <h6 className="mt-3 fw-bold">3. Apply Online</h6>
            <p className="text-muted">Submit your application with required documents.</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 text-center p-3 h-100">
            <i className="bi bi-check-circle text-primary" style={{ fontSize: "2rem" }}></i>
            <h6 className="mt-3 fw-bold">4. Get Approved</h6>
            <p className="text-muted">Receive updates and approvals directly on your dashboard.</p>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default AboutUs;
