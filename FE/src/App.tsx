import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage/LoginPage';
import RegistrationPage from "./components/auth/RegistrationPage/RegistrationPage";
import UserProfile from "./components/UserProfile/UserProfile/UserProfile";
import EditProfile from "./components/UserProfile/EditUserProfile/EditProfile";
import MoviesPage from "./components/MoviesPage/MoviesPage";
import MovieInfoPage from "./components/MovieInfo/MovieInfPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/movie/:id" element={<MovieInfoPage />} />
                <Route path="/movies" element={<MoviesPage />} />
            </Routes>
        </Router>
    );
};

export default App;
