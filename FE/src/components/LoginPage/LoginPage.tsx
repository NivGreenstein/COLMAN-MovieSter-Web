import React, { useState } from 'react';
import './LoginPage.css';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Login with:', email, password);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <img src="../../../public/logo.png" alt="App Logo" className="app-logo" />
                <div>
                    <input
                        type="email"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="email-input"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="password-input"
                    />
                </div>
                <button className="login-button" type="submit">Login</button>
                <p className="signup-text">Don't have an account? Sign up.</p>
            </form>
        </div>
    );
};

export default LoginPage;
