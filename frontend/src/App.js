import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeQueryPage from './HomeQueryPage';
import ResultsPage from './ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeQueryPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
