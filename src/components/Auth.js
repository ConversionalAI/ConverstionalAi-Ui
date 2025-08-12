import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../Login.css';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      setErrorMessage(null);
      setIsLoading(true);
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <img src="/conv_logo.png" alt="Logo" className="auth-logo" />
          <h2 className="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="auth-subtitle">Sign {isSignup ? 'up' : 'in'} to continue your AI coding journey</p>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}

          <div className="input-wrapper">
            <span className="input-icon" aria-hidden>✉️</span>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper">
            <span className="input-icon" aria-hidden>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button className="auth-button" onClick={handleAuth} disabled={isLoading}>
            {isSignup ? (isLoading ? 'Signing up...' : 'Sign Up') : (isLoading ? 'Logging in...' : 'Login')}
          </button>

          <div className="auth-toggle" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </div>

          <div className="auth-terms">By continuing, you agree to our Terms and Privacy Policy.</div>
        </div>
      </div>
      <div className="auth-right">
        <img src="/login_background.png" alt="AI Coding" className="auth-image" />
      </div>
    </div>
  );
};

export default Auth;
