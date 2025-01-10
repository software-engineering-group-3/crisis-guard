import React, { useState } from 'react';
import './styles/Login.css';

function Login() {
  const [showModal, setShowModal] = useState(false);

  const handleGoogleLogin = () => {
    const BACKEND_API_URL = 'https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com';
    window.location.href = `${BACKEND_API_URL}`;
    setTimeout(() => {
      window.location.href = '/maps'; // Simulate successful login redirection
    }, 2000); // Delay for backend processing
  };
  

  return (
    <div>
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
        <p>
          By signing in, you agree to our{' '}
          <a href="#" onClick={() => setShowModal(true)}>
            Terms of Service
          </a>.
        </p>
        <p className="anonymous-link">
          Or continue as <a href="./maps">Anonymous User</a>.
        </p>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Terms of Service</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
