import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage/LoginPage';
import RegistrationPage from "./components/auth/RegistrationPage/RegistrationPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/" element={<RegistrationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
