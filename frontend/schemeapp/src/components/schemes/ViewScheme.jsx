import React, { useState, useEffect,useRef } from 'react';
import {
  Container, Row, Col, Tab, Nav, Button, Form, Alert
} from 'react-bootstrap';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BsStar, BsStarFill } from 'react-icons/bs';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavbarComponent from '../Navbar';
import Footer from '../FooterComponent';

const ViewScheme = () => {
  const { schemeId } = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showEligibilityQuestions, setShowEligibilityQuestions] = useState(false);
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [scheme, setScheme] = useState({});
  const [rating, setRating] = useState(0);

  const [eligibilityQuestions, setEligibilityQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
   const sectionsRef = {
    details: useRef(null),
    benefits: useRef(null),
    eligibility: useRef(null),
    documents: useRef(null),
    check: useRef(null),
    feedback: useRef(null),
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemeRes, profileRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/scheme-view/?schemeId=${schemeId}`, { withCredentials: true }),
          axios.get(`http://localhost:8000/api/user-profile`, { withCredentials: true })
        ]);

        setProfileComplete(profileRes.data.profilecompletion);
        setScheme(schemeRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [schemeId]);
  console.log(scheme,'hello working')
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Save bookmark state via API
  };

  const handleRating = (index) => {
    setRating(index);
    // TODO: Send rating to backend
  };

  const handleAnswerChange = (fieldName, value) => {
    setUserAnswers(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleEligibilityCheck = async () => {
    if (!profileComplete) {
      setShowAlert(true);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/api/check-eligibility/${schemeId}`, {
        withCredentials: true,
      });

      setEligible(res.data.basic_eligibility);
      setEligibilityQuestions(res.data.questions);
      setShowEligibilityQuestions(true);
    } catch (error) {
      console.error("Eligibility check failed:", error);
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/check-eligibility/${schemeId}`, {
        answers: userAnswers
      }, { withCredentials: true });

      setAllAnswersCorrect(res.data.all_answers_correct);
    } catch (error) {
      console.error("Answer submission failed:", error);
    }
  };
  

  const scrollToSection = (key) => {
  const offset = 80; // height of your fixed navbar
  const section = sectionsRef[key]?.current;

  if (section) {
    const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};


  return (
    <>
    <NavbarComponent/>
    


<Container className="mt-5" >
  <Row>
    {/* Mobile Nav Toggle */}
    <Col xs={12} className="d-md-none mb-3">
      <Nav variant="pills" className="flex-row justify-content-around sticky-top bg-white py-2 border-bottom">
        {Object.keys(sectionsRef).map((key) => (
          <Nav.Item key={key}>
            <Nav.Link onClick={() => scrollToSection(key)} className="text-center px-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Col>

    {/* Sidebar for Desktop */}
    <Col md={2} className="d-none d-md-block border-end position-sticky" style={{ top: "80px", height: "100%" }}>
      <Nav variant="pills" className="flex-column">
        {Object.keys(sectionsRef).map((key) => (
          <Nav.Item key={key}>
            <Nav.Link onClick={() => scrollToSection(key)}>{key.charAt(0).toUpperCase() + key.slice(1)}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Col>

    {/* Main Content */}
    <Col xs={12} md={10}>
      <div className="d-flex justify-content-between align-items-start">
        <h3>{scheme.title}</h3>
        <Button variant="outline-success" onClick={handleBookmark} size="sm" className="rounded-circle">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </Button>
      </div>

      <hr />

      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Please complete your profile to check eligibility!
        </Alert>
      )}

      {/* Sections */}
      <div ref={sectionsRef.details} className="mb-5">
        <h5>Scheme Details</h5>
        <p>{scheme.description}</p>
      </div>

      <div ref={sectionsRef.benefits} className="mb-5">
        <h5>Benefits</h5>
        <pre>{scheme.benefits}</pre>
      </div>

      <div ref={sectionsRef.eligibility} className="mb-5">
        <h5>Eligibility Criteria</h5>
        <ul>
          <li>Minimum Age: {scheme.min_age}</li>
          <li>Maximum Age: {scheme.max_age}</li>
          <li>Required Gender: {scheme.gender}</li>
          <li>Required Caste(s): {scheme.eligible_castes}</li>
          <li>Income Limit: {scheme.income_limit}</li>
          <li>Education: {scheme.required_education}</li>
        </ul>
      </div>

      <div ref={sectionsRef.documents} className="mb-5">
        <h5>Required Documents</h5>
        <ul>
          {scheme.required_documents?.split(',').map((doc, i) => (
            <li key={i}>{doc.trim()}</li>
          ))}
        </ul>
      </div>

      <div ref={sectionsRef.check} className="mb-5">
        <h5>Check Eligibility</h5>
        <Button variant="primary" className="mb-3" onClick={handleEligibilityCheck}>
          Check Eligibility
        </Button>

        {eligible && (
          <Form.Check
            type="checkbox"
            label="You meet the basic eligibility criteria"
            checked
            readOnly
          />
        )}

        {showEligibilityQuestions && (
          <div className="mt-3">
            <h6>Answer these questions:</h6>
            {eligibilityQuestions.map((q, idx) => (
              <Form.Group className="mb-2" key={idx}>
                <Form.Label>{q.question_text}</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => handleAnswerChange(q.field_name || q.id, e.target.value)}
                />
              </Form.Group>
            ))}

            <Button variant="success" className="me-2" onClick={handleSubmitAnswers}>
              Submit Answers
            </Button>

            <Button variant="success" disabled={!allAnswersCorrect}>
              Apply
            </Button>
          </div>
        )}
      </div>

      <div ref={sectionsRef.feedback} className="mb-5">
        <h5>Rate this Scheme</h5>
        <div className="d-flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} onClick={() => handleRating(i)} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'gold' }}>
              {rating >= i ? <BsStarFill /> : <BsStar />}
            </span>
          ))}
        </div>
      </div>
    </Col>
  </Row>
</Container>

    <Footer/>
    </>
  );
};

export default ViewScheme;
