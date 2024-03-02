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

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegistrationPage/>}/>
                <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
                <Route path="/profile/:id" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
                <Route path="/edit-profile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
                <Route path="/movie/:id" element={<ProtectedRoute><MovieInfoPage/></ProtectedRoute>}/>
                <Route path="/movies" element={<ProtectedRoute><MoviesPage/></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
};

export default App;
