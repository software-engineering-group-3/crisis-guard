import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import GoogleMapsPage from './MapsFormPage.jsx';
import { onMessage } from "firebase/messaging";
import { messaging } from './firebase.js';

function App() {
  return (
    useEffect(() => {
      onMessage(messaging, (payload) => {
        alert(`Notification: ${payload.notification.title}\n${payload.notification.body}`);
      });
    }, []), 
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/maps" element={<GoogleMapsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
