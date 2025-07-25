import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import logo from '../../images/logo.webp'
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/dj-rest-auth/login/',
        { username, password },
        {
          withCredentials: true,
        }
      );
      toast.success("Login Successful!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMsg('Invalid username or password');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex">
      <Row className="flex-grow-1 w-100">
      
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center bg-light"
        >
          <Form
            onSubmit={handleLogin}
            className="p-5 rounded-4 shadow bg-white w-100"
            style={{ maxWidth: "400px" }}
          >
            <div className="text-center mb-4">
              <h2 className="text-primary fw-bold">Welcome Back</h2>
              <p className="text-muted">Please log in to your account</p>
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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-semibold">
              Log In
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account? </span>
              <Link
                to="/register"
                className="text-primary fw-semibold text-decoration-none"
              >
                Register
              </Link>
            </div>

            <div className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-primary fw-semibold text-decoration-none"
              >
                Forgot password?
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

export default LoginPage;
