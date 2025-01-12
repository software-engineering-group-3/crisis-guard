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
    </div>
  );
}

export default Login;
