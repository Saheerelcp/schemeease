import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Card, Alert, Button ,Form } from 'react-bootstrap';
import NavbarComponent from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaFilePdf,
  FaTimesCircle,
  FaRedo,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
const ResultApply = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [reuploadFiles, setReuploadFiles] = useState({}); // { docId: File }
  const [rejectedDocuments, setRejectedDocuments] = useState([]);

  useEffect(() => {
  //   if (rejectedDocuments.length === 0) {
  //   setStatus("Pending");
  // }
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/result-apply/?applicationId=${applicationId}`, {
          withCredentials: true
        });
        setApplication(res.data.result);
        setStatus(res.data.status);
        console.log(res.data.status)
        if (res.data.status =="Rejected"){
        const rejected = res.data.result;
        console.log(rejected,'hello')
        setRejectedDocuments(rejected);
          
        }
        
      } catch (error) {
        console.error('Error fetching application status:', error);
      } finally {
        setLoading(false);
      }
    };
     
    fetchStatus();
  }, [applicationId]);

  const handleFileChange = (documentId, file) => {
    setReuploadFiles((prev) => ({
      ...prev,
      [documentId]: file,
    }));
  };

  const handleReupload = async (documentId) => {
    const file = reuploadFiles[documentId];
    if (!file) return alert('Please select a file first');

    const formData = new FormData();
    formData.append('file', file);

    try {
       const res=await axios.put(
        `http://localhost:8000/api/reupload-document/?documentId=${documentId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(res.data.message, { position: 'top-right', autoClose: 2000 });
      setRejectedDocuments((prev) => {
      const updatedList = prev.filter((doc) => doc.id !== documentId);
      if (updatedList.length === 0) {
        setStatus("Pending");
      }

      return updatedList;
    });
      
      // Optional: Remove file from state
      setReuploadFiles((prev) => {
        const updated = { ...prev };
        delete updated[documentId];
        
        return updated;
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to re-upload file. Please try again.');
    }
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

  if (!application) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5">
          <Alert variant="danger">Application not found</Alert>
        </Container>
      </>
    );
  }
  
  return (
    <>
    <ToastContainer/>
      <NavbarComponent />
      <Container className="mt-5">
        {status === 'Approved' && (
          <Card className="text-center border-success">
            <Card.Body>
              <Card.Title className="text-success"> Congratulations!</Card.Title>
              <Card.Text>
                Your application for <strong>{application.scheme_name}</strong> has been applied.
              </Card.Text>
              <Button variant="success" href={`http://localhost:8000${application.printout}`} download target="_blank">
                Download PDF
              </Button>
            </Card.Body>
          </Card>
        )}

        {status === 'Rejected' && (
          <Card className="border-danger mt-4">
  <Card.Body>
    <Card.Title className="text-danger d-flex align-items-center">
      <FaTimesCircle className="me-2" /> Application Rejected
    </Card.Title>
<h5 className="mb-4 text-primary">
          Scheme: <span className="fw-bold">{application[0]?.scheme_name}</span>
        </h5>
    <p className="mb-3">
      Some documents were rejected. Please review and re-upload the necessary files.
    </p>

    <div className="list-group">
      {rejectedDocuments.map((doc, index) => (
        <div key={index} className="list-group-item mb-3 border rounded shadow-sm p-3">
          <div className="row align-items-center mb-2">
          
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <FaFilePdf className="text-danger fs-5" />
                <span className="ms-2 fw-bold">{doc.required_document}</span>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm"
              >
                <FaDownload className="me-1" />
                View
              </a>
            </div>
          </div>

          {/* Bottom Row: Reason + Reupload */}
          <div className="row align-items-center">
            {/* Left: Reason */}
            <div className="col-md-8">
              <div className="text-muted">
                <strong>Reason:</strong> {doc.rejection_reason}
              </div>
            </div>

            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-2">
                <Form.Control
                  type="file"
                  id={`file-input-${doc.id}`}
                  className="d-none"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                />

                <label htmlFor={`file-input-${doc.id}`} className="btn btn-outline-primary btn-sm mb-0">
                  <FaUpload className="me-1" />
                  Upload
                </label>

                <Button
                  variant="outline-success"
                  size="sm"
                  className="mb-0"
                  onClick={() => handleReupload(doc.id)}
                  disabled={!reuploadFiles[doc.id]}
                >
                  <FaRedo className="me-1" />
                  Confirm
                </Button>
              </div>

              {/* File Name (below buttons) */}
              {reuploadFiles[doc.id] && (
                <div className="text-muted small mt-1 text-truncate" style={{ maxWidth: '100%' }}>
                  {reuploadFiles[doc.id].name}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card.Body>
</Card>

        )}

        {status === 'Pending' && (
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
