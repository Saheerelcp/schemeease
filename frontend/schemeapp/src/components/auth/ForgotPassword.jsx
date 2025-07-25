import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestOtpPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate()
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/request-otp/', { email });
      setMessage(response.data.message || 'OTP sent to your email.');
      navigate('/otp-verify')
      localStorage.setItem('login_email', email);

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="otp-request-container">
      <h2>Login with Email OTP</h2>
      <form onSubmit={handleRequestOtp}>
        <label>Enter your Email:</label><br />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestOtpPage;
