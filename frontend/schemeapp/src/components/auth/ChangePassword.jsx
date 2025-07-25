import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resendAvailable, setResendAvailable] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('login_email');
    const startTime = localStorage.getItem('otp_start_time');

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Email not found. Please go back and enter your email again.');
    }

    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      setTimer(Math.max(300 - elapsed, 0));
    } else {
      const now = Date.now();
      localStorage.setItem('otp_start_time', now.toString());
      setTimer(300);
    }
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) {
      setResendAvailable(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    const val = element.value.replace(/\D/, '');
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (index < 5 && val) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        email,
        otp: otp.join(''),
      });

      toast.success(response.data.message || 'OTP verified successfully!');
      localStorage.removeItem('otp_start_time');
      navigate('/confirm-password');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Invalid OTP or expired.';
      setError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/request-otp/', {
        email,
      });

      toast.success(response.data.message || 'New OTP sent to your email!');
      const now = Date.now();
      localStorage.setItem('otp_start_time', now.toString());
      setTimer(300);
      setResendAvailable(false);
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
        <h4 className="text-center text-primary mb-3">Verify OTP</h4>
        {email && <p className="text-muted text-center"><strong>Verifying for:</strong> {email}</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleVerifyOtp}>
          <div className="d-flex justify-content-between mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}
                className="form-control text-center"
                style={{ width: '45px', height: '45px', fontSize: '18px' }}
                required
              />
            ))}
          </div>

          <div className="text-center mb-2">
            {resendAvailable ? (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-muted" style={{ fontSize: '14px' }}>
                Resend available in: <strong>{formatTime(timer)}</strong>
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
