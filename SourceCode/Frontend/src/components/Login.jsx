import React from 'react';
import './CompStyle/Login.css';


function Login() {
  const handleGoogleLogin = () => {
    const BACKEND_API_URL = 'http://localhost:8080';
    window.location.href = `${BACKEND_API_URL}/auth/google`; 
  };

  return (
    <div className="login-container">
      <h1>Welcome to Crisis Guard</h1>
      <p className="oauth-text">Protecting what matters, together.</p>
      <button className="oauth-button" onClick={handleGoogleLogin}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
        />
        Sign in with Google
      </button>
      <p>By signing in, you agree to our <a href="/terms">Terms of Service</a>.</p>
    </div>
  );
}

export default Login;

