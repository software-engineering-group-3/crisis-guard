import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import IncidentReportA from './MapsFormPageAnon.jsx';
import IncidentReportG from './MapsFormPageGove.jsx';
import IncidentReportH from './MapsFormPageHuma.jsx';
import IncidentReportU from './MapsFormPageLogUser.jsx';

function App() {
  return (
        <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mapsAnon" element={<IncidentReportA />} />
          <Route path="/mapsLogUser" element={<IncidentReportU />} />
          <Route path="/mapsHuma" element={<IncidentReportH />} />
          <Route path="/mapsGove" element={<IncidentReportG />} />
        </Routes>
      </Router>
  );
}

export default App;
