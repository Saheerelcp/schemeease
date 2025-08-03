import React, { useState, useEffect, useRef } from 'react';
import {
    Container, Row, Col, Tab, Nav, Button, Form, Alert, Modal
} from 'react-bootstrap';
import { FaRegBookmark, FaBookmark, FaDownload } from 'react-icons/fa';
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
    const [reasons, setReasons] = useState('')

    const [eligibilityQuestions, setEligibilityQuestions] = useState([]);
    const [showResultModal, setShowResultModal] = useState(false);

    const [userAnswers, setUserAnswers] = useState({});
    const sectionsRef = {
        details: useRef(null),
        benefits: useRef(null),
        eligibility: useRef(null),
        documents: useRef(null),
        attachment: useRef(null),
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

                setProfileComplete(profileRes.data.profilecomplete);
                console.log(profileRes.data.profilecomplete, 'heloooooooooooooooo')
                setScheme(schemeRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [schemeId]);
    console.log(profileComplete, 'hello working')
    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        // TODO: Save bookmark state via API
    };

    const handleRating = (index) => {
        setRating(index);
        // TODO: Send rating to backend
    };



    const handleEligibilityCheck = async () => {
        if (!profileComplete) {
            setShowAlert(true);
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8000/api/check-eligibility/?schemeId=${schemeId}`, {
                withCredentials: true,
            });

            setEligible(res.data.basic_eligibility);
            setEligibilityQuestions(res.data.questions);
            setShowEligibilityQuestions(res.data.basic_eligibility);
            setReasons(res.data.reasons)
        } catch (error) {
            console.error("Eligibility check failed:", error);
        }
    };

    const handleSubmitAnswers = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/check-eligibility/?schemeId=${schemeId}`, {
                answers: userAnswers
            }, { withCredentials: true });

            setAllAnswersCorrect(res.data.all_answers_correct);
            setShowResultModal(true);
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
            <NavbarComponent />



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
                            <h3 className='text-primary'>{scheme.title}</h3>
                            <Button variant="outline-success" onClick={handleBookmark} size="sm" className="rounded-circle">
                                {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                            </Button>
                        </div>

                        <hr />



                        {/* Sections */}
                        <div ref={sectionsRef.details} className="mb-5">
                            <h5 className='text-primary'>Scheme Details</h5>
                            <p>{scheme.description}</p>
                        </div>

                        <div ref={sectionsRef.benefits} className="mb-5">
                            <h5 className='text-primary'>Benefits</h5>
                            <p>{scheme.benefits}</p>
                        </div>

                        <div ref={sectionsRef.eligibility} className="mb-5">
                            <h5 className='text-primary'>Eligibility Criteria</h5>
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
                            <h5 className='text-primary'>Required Documents</h5>
                            <ul>
                                {scheme.required_documents?.split(',').map((doc, i) => (
                                    <li key={i}>{doc.trim()}</li>
                                ))}
                            </ul>
                        </div>

                        {scheme.attachment && <div ref={sectionsRef.attachment} className='mb-5'>
                            <a
                                href={`http://localhost:8000${scheme.attachment}`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaDownload /> Download Attachment
                            </a>
                        </div>}
                        <div ref={sectionsRef.check} className="mb-5">
                            {showAlert && (
                                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                    Please complete your profile to check eligibility!
                                </Alert>
                            )}
                            <h5>Check Eligibility</h5>
                            <Button variant="primary" className="mb-3" onClick={handleEligibilityCheck}>
                                Check Eligibility
                            </Button>

                            {eligible && (
                                <>
                                    <Form.Check
                                        type="checkbox"
                                        label="You meet the basic eligibility criteria"
                                        checked
                                        readOnly
                                    />

                                </>
                            )}
                            {reasons.length > 0 && (
                                <div className="alert alert-danger" role="alert">
                                    <strong>You are not eligible to apply.</strong><br />
                                    Your profile details do not match the scheme's eligibility criteria:
                                    <ul className="mb-0 mt-2">
                                        {reasons.map((reason, index) => (
                                            <li key={index}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {showEligibilityQuestions && (
                                <div className="mt-3">
                                    <h6 className='text-primary'>Answer these questions:</h6>
                                    {eligibilityQuestions.map((q, idx) => (
                                        <Form.Group className="mb-2" key={idx}>
                                            <Form.Label>{q.question_text}</Form.Label>
                                            <div>
                                                <Form.Check
                                                    type="radio"
                                                    className='text-black'
                                                    label="Yes"
                                                    name={`question-${q.id}`}
                                                    value="Yes"
                                                    onChange={() =>
                                                        setUserAnswers((prev) => ({
                                                            ...prev,
                                                            [q.field_name || q.id]: 'Yes',
                                                        }))
                                                    }
                                                    inline
                                                    checked={userAnswers[q.field_name || q.id] === 'Yes'}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="No"
                                                    className='text-black '
                                                    name={`question-${q.id}`}
                                                    value="No"
                                                    onChange={() =>
                                                        setUserAnswers((prev) => ({
                                                            ...prev,
                                                            [q.field_name || q.id]: 'No',
                                                        }))
                                                    }
                                                    inline
                                                    checked={userAnswers[q.field_name || q.id] === 'No'}
                                                />
                                            </div>
                                        </Form.Group>
                                    ))}

                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={handleSubmitAnswers}
                                        disabled={
                                            eligibilityQuestions.length === 0 ||
                                            eligibilityQuestions.some(
                                                (q) => !(userAnswers[q.field_name || q.id])
                                            )
                                        }
                                    >
                                        Submit Answers

                                    </Button>


                                </div>
                            )}
                        </div>
                        <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title className='text-primary'>{allAnswersCorrect ? "Congratulations!" : "Not Eligible"}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {allAnswersCorrect ? (
                                    <p >You are eligible for this scheme. You may now apply.</p>
                                ) : (
                                    <p>Sorry, based on your answers you are not eligible.</p>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                {allAnswersCorrect ? (
                                    <Button variant="success" onClick={() => {
                                        // You can trigger apply action here or redirect
                                        setShowResultModal(false);
                                    }}>
                                        Apply
                                    </Button>
                                ) : (
                                    <Button variant="danger" onClick={() => setShowResultModal(false)}>
                                        Close
                                    </Button>
                                )}
                            </Modal.Footer>
                        </Modal>

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

            <Footer />
        </>
    );
};

export default ViewScheme;
