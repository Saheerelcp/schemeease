import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  // Fetch email from localStorage when the page loads
  useEffect(() => {
    const storedEmail = localStorage.getItem('login_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Email not found. Please go back and enter your email again.');
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        email,
        otp,
      });
      setMessage(response.data.message || 'OTP verified successfully.');
      navigate('/confirm-password')
      // Optionally, redirect or store token
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP or expired.');
    }
  };

  return (
    <div className="otp-verify-container">
      <h2>Verify OTP</h2>
      {email && (
        <p><strong>Verifying for:</strong> {email}</p>
      )}
      <form onSubmit={handleVerifyOtp}>
        <label>Enter OTP:</label><br />
        <input
          type="text"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        /><br />
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyOtpPage;
