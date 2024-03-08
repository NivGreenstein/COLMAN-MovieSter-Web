// src/App.tsx

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './components/auth/LoginPage/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage/RegistrationPage';
import UserProfile from "./components/UserProfile/UserProfile/UserProfile";
import EditProfile from "./components/UserProfile/EditUserProfile/EditProfile";
import MoviesPage from "./components/MoviesPage/MoviesPage";
import MovieInfoPage from "./components/MovieInfo/MovieInfPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWithHeader from "./components/header/LayoutWithHeader";
import { GoogleOAuthProvider } from '@react-oauth/google';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT}>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/" element={<LayoutWithHeader> <ProtectedRoute><MoviesPage /></ProtectedRoute> </LayoutWithHeader>} />
                <Route path="/profile" element={<LayoutWithHeader> <ProtectedRoute><UserProfile /></ProtectedRoute> </LayoutWithHeader>} />
                <Route path="/profile/:id" element={<LayoutWithHeader> <ProtectedRoute><UserProfile /></ProtectedRoute> </LayoutWithHeader>} />
                <Route path="/edit-profile" element={<LayoutWithHeader> <ProtectedRoute><EditProfile /></ProtectedRoute> </LayoutWithHeader>} />
                <Route path="/movie/:id" element={<LayoutWithHeader> <ProtectedRoute><MovieInfoPage /></ProtectedRoute> </LayoutWithHeader>} />
                <Route path="/movies" element={<LayoutWithHeader> <ProtectedRoute><MoviesPage /></ProtectedRoute> </LayoutWithHeader>} />
            </Routes>
        </Router>
    </GoogleOAuthProvider>
    );
};

export default App;
