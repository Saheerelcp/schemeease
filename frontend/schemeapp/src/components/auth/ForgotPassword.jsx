import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RequestOtpPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
       await axios.post('http://localhost:8000/api/request-otp/', { email });
      toast.success('OTP sent to your email!', {
        position: 'top-right',
        autoClose: 2000,
      });

      localStorage.setItem('login_email', email);
      setTimeout(() => navigate('/otp-verify'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />

      <form
        onSubmit={handleRequestOtp}
        className="p-5 rounded-4 shadow bg-white"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">Request OTP</h2>
          <p className="text-muted">Enter your email to receive a login OTP</p>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-semibold">
          Send OTP
        </button>

        {error && (
          <Alert variant="danger" className="mt-3 text-center py-2">
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default RequestOtpPage;
