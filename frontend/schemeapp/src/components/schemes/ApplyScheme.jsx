import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {   useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Spinner,Alert } from 'react-bootstrap';
import Footer from '../FooterComponent';
import NavbarComponent from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyScheme = () => {
  const navigate = useNavigate()
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState({});
  const [uploads, setUploads] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [repeat,setRepeat] = useState(false);
  // const navigate = useNavigate()
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/scheme-view/?schemeId=${schemeId}`, {
          withCredentials: true,
        });
        setScheme(res.data);
      } catch (err) {
        console.error('Something went wrong:', err);
        toast.error('Failed to fetch scheme details.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [schemeId]);
  console.log(submitted)
  const handleFileChange = (docId, file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploads((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(uploads).forEach(([docId, file]) => {
      formData.append(`documents[${docId}]`, file);
    });
    console.log(formData,'hello')
    try {
       const res = await axios.post(
        `http://localhost:8000/api/apply-scheme/?schemeId=${schemeId}`,
        formData,
        {
          withCredentials: true,
          headers: {
      'Content-Type': 'multipart/form-data', 
    },
        }
      );

      setSubmitted(true);

      toast.success(res.data, { position: 'top-right', autoClose: 2000 });

      if(res.data.repeat){
        setRepeat(true)
      }
      else if(res.data){
        setTimeout(() => {
          navigate('/application-view')
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting application", error);
      toast.error("Submission failed");
    }
  };

  const isSubmitDisabled = () => {
    if (!scheme.required_documents) return true;

    return scheme.required_documents.some((doc) => !uploads[doc.id]);
  };
  if (loading) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading application status...</p>
        </Container>
      </>
    );
  }
  return (
    <>
      <NavbarComponent />
      <Container className="mt-5 mb-5">
        {repeat && <Alert>You are already applied for this scheme .</Alert>}
        <Card
          className="shadow p-4"
          style={{
            backgroundColor: '#f0f8ff',
            border: '1px solid #cce5ff',
          }}
        >
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <h3 className="text-primary text-center mb-4">{scheme.title}</h3>

              <Form onSubmit={handleSubmit}>
                {scheme.required_documents?.map((doc) => (
                  <Form.Group as={Row} className="mb-4" controlId={`doc-${doc.id}`} key={doc.id}>
                    <Form.Label column sm={4} className="fw-semibold text-primary">
                      {doc.name}
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                        required
                      />
                      {uploads[doc.id] && (
                        <small className="text-success">Selected: {uploads[doc.id].name}</small>
                      )}
                    </Col>
                  </Form.Group>
                ))}

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <Button variant="outline-primary" type="button" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitDisabled()}>
                    Submit Application
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card>
      </Container>
      <Footer />
      <ToastContainer  />
    </>
  );
};

export default ApplyScheme;
