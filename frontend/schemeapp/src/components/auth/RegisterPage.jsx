import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../../images/logo.webp'

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:8000/dj-rest-auth/registration/',
        { username, email, password1, password2 },
        { withCredentials: true }
      );

      toast.success('Registration Successful!', {
        position: 'top-right',
        autoClose: 2000,
      });
      localStorage.setItem('justregistered','true')

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        const data = error.response.data;
        const firstError =
          data.username?.[0] ||
          data.email?.[0] ||
          data.password1?.[0] ||
          data.non_field_errors?.[0] ||
          'Registration failed!';
        setMsg(firstError);
      } else {
        setMsg('Something went wrong.');
      }
    }
  };

  return (
    <Container fluid className="vh-100 d-flex">
      <Row className="flex-grow-1 w-100">
        {/* Left: Signup Form */}
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center bg-light"
        >
          <Form
            onSubmit={handleRegister}
            className="p-5 rounded-4 shadow bg-white w-100"
            style={{ maxWidth: '500px' }}
          >
            <div className="text-center mb-4">
              <h2 className="text-primary fw-bold">Create Account</h2>
              <p className="text-muted">Sign up to get started</p>
            </div>

            {msg && (
              <Alert variant="danger" className="text-center py-2">
                {msg}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password1">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Minimum 8 characters"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password2">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 fw-semibold">
              Register
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Link to="/" className="text-primary fw-semibold text-decoration-none">
                Login here
              </Link>
            </div>
          </Form>
        </Col>

         <Col
                  md={6}
                  className="d-flex flex-column justify-content-center align-items-center text-text-white bg-light text-center px-5"
                >
                  <div>
                   
                    <div className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: 200, height: 200 }}>
                      <img src={logo} alt="Logo" className="img-fluid" style={{ width: 110 }} />
        
                    </div>
                    <h2 className="fw-bold mb-3 text-primary">Welcome to SchemeEase</h2>
                    <p className="lead">
                      SchemeEase is a simple and secure platform that helps users discover and apply for government welfare schemes.
                       We make it easier to check your eligibility, track your applications, 
                       and stay updated with the latest benefits — all in one place.
                    </p>
                    
                  </div>
                </Col>
      </Row>

      <ToastContainer />
    </Container>
  );
}

export default RegisterPage;
