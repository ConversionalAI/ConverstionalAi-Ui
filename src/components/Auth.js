import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

// Simple Auth screen that uses Supabase OAuth (Google) only.
// This removes the previous email/password flow and replaces it with a
// "Sign in with Google" button. App listens to auth state changes and
// will update the user after the redirect/popup completes.
const Auth = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setInfoMsg('');

    try {
      // Initiates the OAuth flow. This will redirect the browser to Google's
      // consent screen unless you configure a popup flow in Supabase settings.
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        setErrorMsg(error.message || 'Failed to start Google sign-in.');
      } else {
        setInfoMsg('Redirecting to Google for authentication...');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Unexpected error while starting sign-in.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <h2 className="auth-title">Sign in</h2>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}
          {infoMsg && <p className="auth-message">{infoMsg}</p>}

          <button className="auth-button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>

          <p style={{ marginTop: '1rem', color: '#666' }}>
            You'll be redirected to Google to sign in.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <img src="/login_background.png" alt="AI Coding" className="auth-image" />
      </div>
    </div>
  );
};

export default Auth;
