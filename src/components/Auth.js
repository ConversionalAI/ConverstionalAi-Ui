import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // for success/info messages
  const [errorMsg, setErrorMsg] = useState(''); // for error messages

  const handleAuth = async () => {
    setMessage('');
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({ email, password });

        if (result.error) {
          if (result.error.message.includes('already registered')) {
            setErrorMsg('This email is already registered. Please log in instead.');
          } else {
            setErrorMsg(result.error.message);
          }
          return;
        }

        // Supabase requires email confirmation if enabled
        setMessage('Sign-up successful! Please check your email inbox for a confirmation link to verify your account.');
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });

        if (result.error) {
          setErrorMsg(result.error.message);
          return;
        }

        setMessage('Login successful!');
      }
    } catch (error) {
      console.error(error.message);
      setErrorMsg('Something went wrong.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}
          {message && <p className="auth-message">{message}</p>}

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" onClick={handleAuth}>
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          <div className="auth-toggle" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <img src="/login_background.png" alt="AI Coding" className="auth-image" />
      </div>
    </div>
  );
};

export default Auth;
