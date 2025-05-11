import React, { useState, useEffect } from 'react';
import './App.css'; // You might want a specific CSS file for LoginPage later
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to generate CAPTCHA string
const generateCaptcha = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function LoginPage({ onLoginSuccess, onShowRegister }) { // Added onShowRegister prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput(''); // Clear previous input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (captchaInput !== captcha) {
      setError('CAPTCHA verification failed. Please try again.');
      setLoading(false);
      refreshCaptcha(); // Refresh CAPTCHA on failure
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed. Please check your credentials.');
      }

      // Handle successful login
      console.log('Login successful:', data);
      if (onLoginSuccess) {
        onLoginSuccess(data.user); // Pass user data or a token
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
      console.error('Login error:', err);
      refreshCaptcha(); // Refresh CAPTCHA on login error too
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="login-form" style={{ padding: '40px', background: 'var(--surface-light)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-light)' }}>CMS Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}
            />
          </div>

          {/* CAPTCHA Section */}
          <div className="form-group captcha-container" style={{ marginBottom: '20px' }}>
            <label htmlFor="captcha" style={{ display: 'block', marginBottom: '5px' }}>Verify CAPTCHA:</label>
            <div className="captcha-display" style={{ 
              padding: '10px', 
              border: '1px solid var(--border-light)', 
              borderRadius: '4px', 
              marginBottom: '10px', 
              textAlign: 'center', 
              fontSize: '1.5em', 
              letterSpacing: '0.2em',
              fontFamily: 'monospace',
              userSelect: 'none', /* Prevent text selection */
              background: 'var(--bg-light)',
              color: 'var(--text-light)'
            }}>
              {captcha}
            </div>
            <input
              type="text"
              id="captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)', marginBottom: '5px' }}
              autoComplete="off"
            />
            <button 
              type="button" 
              onClick={refreshCaptcha} 
              className="refresh-captcha-btn"
              style={{ 
                fontSize: '0.8em', 
                padding: '5px 10px', 
                background: 'transparent', 
                border: '1px solid var(--border-light)', 
                color: 'var(--text-light)',
                cursor: 'pointer'
              }}
            >
              Refresh CAPTCHA
            </button>
          </div>
          {/* End CAPTCHA Section */}

          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'var(--primary-light)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onShowRegister} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-light)', 
              cursor: 'pointer', 
              padding: '0',
              textDecoration: 'underline' 
            }}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
