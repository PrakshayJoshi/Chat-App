import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import './styles/App.css';

const App = () => {
  return (
    <div className="app-container">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
