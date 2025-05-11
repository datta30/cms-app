import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming general styles are here or in a specific registration CSS

// Helper function to generate CAPTCHA string (can be moved to a utils file)
const generateCaptcha = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function RegistrationPage({ onRegisterSuccess, onShowLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (captchaInput !== captcha) {
      setError('CAPTCHA verification failed. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed.');
      }

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="login-form" style={{ padding: '40px', background: 'var(--surface-light)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-light)' }}>Register New Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
          </div>

          {/* CAPTCHA Section */}
          <div className="form-group captcha-container" style={{ marginBottom: '20px' }}>
            <label htmlFor="captchaReg">Verify CAPTCHA:</label>
            <div className="captcha-display">
              {captcha}
            </div>
            <input type="text" id="captchaReg" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)', marginBottom: '5px' }} autoComplete="off" />
            <button type="button" onClick={refreshCaptcha} className="refresh-captcha-btn">Refresh CAPTCHA</button>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'var(--primary-light)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <button type="button" onClick={onShowLogin} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', padding: '0', textDecoration: 'underline' }}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
