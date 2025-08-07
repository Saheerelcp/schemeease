import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Card, Alert, Button } from 'react-bootstrap';
import NavbarComponent from '../Navbar';

const ResultApply = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/result-apply/?applicationId=${applicationId}`,{withCredentials:true});
        setApplication(res.data);
      } catch (error) {
        console.error('Error fetching application status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [applicationId]);
  console.log(application)
  if (loading) {
    return (
        <>
        <NavbarComponent/>
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading application status...</p>
      </Container>
      </>
    );
  }

  if (!application) {
    return (
        <>
        <NavbarComponent/>
        
      <Container className="mt-5">
        <Alert variant="danger">Application not found</Alert>
      </Container>
      </>
    );
  }

  return (
    <>
    <NavbarComponent/>
    <Container className="mt-5">
      {application.status === 'Approved' && (
        <Card className="text-center border-success">
          <Card.Body>
            <Card.Title className="text-success">🎉 Congratulations!</Card.Title>
            <Card.Text>
              Your application for <strong>{application.scheme_name}</strong> has been approved.
            </Card.Text>
            <Button variant="success" href={`http://localhost:8000${application.printout}`} download target="_blank">
              Download PDF
            </Button>
          </Card.Body>
        </Card>
      )}

      {application.status === 'Rejected' && (
        <Card className="border-danger">
          <Card.Body>
            <Card.Title className="text-danger">❌ Application Rejected</Card.Title>
            <Card.Text>Reason(s) for rejection:</Card.Text>
            <ul className="list-group">
              {application.rejected_documents.map((doc, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{doc.name}</strong>
                    <br />
                    <small className="text-muted">{doc.rejection_reason}</small>
                  </div>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}

      {application.status === 'Pending' && (
        <Card className="text-center border-warning">
          <Card.Body>
            <Card.Title className="text-warning">⏳ Application Under Review</Card.Title>
            <Card.Text>
              Your application is still under review. Please check back later.
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
    </>
  );
};

export default ResultApply;
