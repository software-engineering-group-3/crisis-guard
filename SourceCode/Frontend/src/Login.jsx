import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import config from './config';

function Login() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  const handleGoogleLogin = async () => {
    // Construct the OAuth 2.0 URL for Google's authorization
    const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` + 
      `redirect_uri=http://localhost:8080/login/oauth2/code/google&` +  // Ensure this matches your redirect URI in Google API settings
      `response_type=code&` + 
      `scope=profile%20email`;

    // Redirect to Google OAuth authorization page
    window.location.href = authUrl;
  };

  // Optional: Function for handling the callback once the user is redirected back to your app
  const handleOAuthCallback = async (authorizationCode) => {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = {
      //code: authorizationCode,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,  // Replace with your actual client secret
      redirect_uri: 'http://localhost:8080/login/oauth2/code/google',  // Should match your redirect URI in Google API settings
      //grant_type: 'authorization_code',
    };

    try {
      // Exchange the authorization code for an access token
      const response = await axios.post(tokenUrl, params);
      const accessToken = response.data.access_token;

      // Use the access token to get user profile information
      const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userProfile = profileResponse.data;
      console.log(userProfile); // Handle the user's profile data

      // Send the token to your backend
      const backendResponse = await axios.post('https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/', { token: accessToken });

      if (backendResponse.status === 200) {
        const { userType } = backendResponse.data;

        // Redirect based on user type
        switch (userType) {
          case 'anonymous':
            navigate('/mapsAnon');
            break;
          case 'regular':
            navigate('/mapsLogUser');
            break;
          case 'humanitary':
            navigate('/mapsHuma');
            break;
          case 'goverment':
            navigate('/mapsGove');
            break;
          default:
            console.error('Unknown user type.');
            navigate('/');
        }
      } else {
        console.error('Login failed:', backendResponse.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Check if we are in the callback route and handle OAuth response
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      handleOAuthCallback(authorizationCode);
    }
  }, []);


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
          <a href="#" onClick={(e) => {
    e.preventDefault();
    setShowModal(true); // Open Terms of Service modal
}}>
  Terms of Service
</a>
        </p>
        <p className="anonymous-link">
          Or continue as <a href="./mapsAnon">Anonymous User</a>.
        </p>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setShowModal(false)} // Close modal
            >
              &times;
            </span>
            <span>
            <h2>Terms of Service</h2>
            <div className="modal-body">
            <p>
            Welcome to Crisis Guard, a platform for managing crises and coordinating disaster response. These Terms of Service govern your access to and use of the Crisis Guard application.
</p>
<p>
1. Acceptance of Terms -
By creating an account, accessing, or using the Service, you confirm that:
You are at least 18 years old or have parental/guardian consent to use the Service.
You have read, understood, and agree to these Terms.
</p><p>
2. Description of Service -
Crisis Guard provides tools for:
Submitting and managing crisis reports.
Viewing interactive maps for disaster management.
Receiving safety warnings and notifications.
Coordinating resources for authorities and humanitarian organizations.
</p><p>
3. Account Responsibilities -
You are responsible for maintaining the confidentiality of your account credentials and activities.
You must provide accurate and truthful information during account registration.
Notify us immediately of any unauthorized access to your account.
</p><p>
4. Acceptable Use - 
You agree not to:
Use the Service for unlawful, fraudulent, or malicious purposes.
Interfere with or disrupt the integrity or performance of the Service.
Submit false or misleading information or reports.
Attempt to reverse-engineer, modify, or hack the Service.
We reserve the right to suspend or terminate your account if you violate these Terms.
</p><p>
5. User-Generated Content - 
Users may submit content such as reports, comments, and other materials ("User Content").
By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content for the operation and promotion of the Service.
You are responsible for the accuracy, legality, and appropriateness of the content you submit.
</p><p>
6. Disclaimers - 
The Service is provided "as is" without warranties of any kind, express or implied.
Crisis Guard does not guarantee the accuracy, completeness, or timeliness of the information provided through the Service.
</p><p>
7. Limitation of Liability - 
To the extent permitted by law:

Crisis Guard shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
</p>
            </div>
            </span>
            <button
              className="close-modal-button"
              onClick={() => setShowModal(false)} // Close modal
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
