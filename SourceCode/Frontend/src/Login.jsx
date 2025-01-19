import React, { useState, useEffect } from 'react';
import { getToken, onMessage } from './firebase'; // Import Firebase messaging
import './styles/Login.css';
import { messaging } from './firebase.js';

function Login() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [token, setToken] = useState(null); // To store the token

  const handleGoogleLogin = () => {
    const BACKEND_API_URL = 'https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/oauth2/authorization/google';
    window.location.href = `${BACKEND_API_URL}`;
    setTimeout(() => {
      window.location.href = '/maps'; // Simulate successful login redirection
    }, 2000); // Delay for backend processing
  };

  const requestNotificationPermission = async () => {
        setConfirmationMessage('Are you sure you want to subscribe to notifications?');
        setShowConfirmation(true); 
  };

  const subscribeUserToNotifications = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BEJJHDd6w8J-Zt-JJl8VuMDm9zNGad_VQJuPYGr6nGLc0vGlv44gvBJseoOuRpKBicuwydf0H7YnOZycgO2n-SU',
      });
      if (currentToken) {
        setToken(currentToken);
        const formData = new FormData();
        console.log(currentToken);
        formData.append('token', currentToken);  
        const response = await fetch('https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/api/notifications/subscribe', {
          method: 'POST',
          body: formData,  
        });
        if (response.ok) {
          alert('Subscription successful!');
        } else if (response.status === 500) {
          alert('You are already subscribed!');
        } else {
          console.error('Error subscribing user:', response.statusText);
        }
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }

    } catch (err) {
      console.error('Error subscribing user:', err);
      if (err.code === 'messaging/permission-blocked') {
        alert('You have blocked notifications for this site. Please enable them in your browser settings.');
      }
    }
  };

  const unsubscribeUserFromNotifications = async () => {
    try {
      const formData = new FormData();
      formData.append('token', token);

      const response = await fetch('https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/notifications/unsubscribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('You have unsubscribed successfully.');
        setToken(null);
      } else {
        console.error('Error unsubscribing user:', response.statusText);
      }
    } catch (error) {
      console.error('Error unsubscribing user:', error);
    }
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
        <button onClick={requestNotificationPermission} style={{marginBottom: '10px'}}>
          Enable Push Notifications
        </button>
        {token && (
          <button onClick={unsubscribeUserFromNotifications}>
            Unsubscribe from Notifications
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Terms of Service</h2>
            <p>
              Welcome to Crisis Guard, a platform for managing crises and coordinating disaster response. These Terms of Service ("Terms") govern your access to and use of the Crisis Guard application, website, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
            </p>
            <p>
              1. Acceptance of Terms
              By creating an account, accessing, or using the Service, you confirm that:
              You are at least 18 years old or have parental/guardian consent to use the Service.
              You have read, understood, and agree to these Terms.
            </p><p>
              2. Description of Service
              Crisis Guard provides tools for:
              Submitting and managing crisis reports.
              Viewing interactive maps for disaster management.
              Receiving safety warnings and notifications.
              Coordinating resources for authorities and humanitarian organizations.
              The Service is available to users in various roles, including unsigned users, citizens, authorities, and humanitarian organizations.
            </p><p>
              3. Account Responsibilities
              You are responsible for maintaining the confidentiality of your account credentials and activities.
              You must provide accurate and truthful information during account registration.
              Notify us immediately of any unauthorized access to your account.
            </p><p>
              4. Acceptable Use
              You agree not to:
              Use the Service for unlawful, fraudulent, or malicious purposes.
              Interfere with or disrupt the integrity or performance of the Service.
              Submit false or misleading information or reports.
              Attempt to reverse-engineer, modify, or hack the Service.
              We reserve the right to suspend or terminate your account if you violate these Terms.
            </p><p>
              5. User-Generated Content
              Users may submit content such as reports, comments, and other materials ("User Content").
              By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content for the operation and promotion of the Service.
              You are responsible for the accuracy, legality, and appropriateness of the content you submit.
            </p><p>
              6. Privacy
              Your use of the Service is subject to our Privacy Policy. We process your data in accordance with applicable privacy laws and our policy.
            </p><p>
              7. Disclaimers
              The Service is provided "as is" without warranties of any kind, express or implied.
              Crisis Guard does not guarantee the accuracy, completeness, or timeliness of the information provided through the Service.
              We are not responsible for any decisions made based on the information provided in the app.
            </p><p>
              8. Limitation of Liability
              To the extent permitted by law:

              Crisis Guard shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
              Our total liability for any claims under these Terms is limited to the amount you paid (if any) to use the Service in the past 12 months.
            </p><p>
              9. Modifications to the Service
              We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any time with or without notice. We are not liable for any changes or interruptions to the Service.
            </p><p>
              10. Termination
              We may terminate or suspend your access to the Service at our discretion, without prior notice, if you violate these Terms.
            </p><p>
              11. Governing Law
              These Terms are governed by and construed in accordance with the laws of [Your Country/Region]. Any disputes shall be resolved in the courts of [Your Jurisdiction].
            </p><p>
              12. Contact Information
              If you have any questions about these Terms, you can contact us at:
              Email: [Insert Email Address]
              Phone: [Insert Phone Number]
              Mailing Address: [Insert Address]
            </p><p>
              13. Changes to Terms
              We may update these Terms from time to time. We will notify you of significant changes by posting a notice on our website or within the Service. Your continued use of the Service constitutes your acceptance of the updated Terms.
            </p>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowConfirmation(false)}>
              &times;
            </span>
            <h2>Confirmation</h2>
            <p>{confirmationMessage}</p>
            <button
              onClick={() => {
                subscribeUserToNotifications(); 
                setShowConfirmation(false);
              }}
            >
              Yes
            </button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
