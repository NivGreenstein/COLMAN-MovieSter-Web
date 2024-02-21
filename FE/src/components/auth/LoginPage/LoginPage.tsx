import React, { useState } from 'react';
import './LoginPage.css';
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";
import logo from "../../../assets/logo.png"; // Adjust the path accordingly


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [passwordValid, setPasswordValid] = useState<boolean>(true)

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        setEmailValid(emailRegex.test(email));
        setPasswordValid(passwordRegex.test(password));

        if(emailRegex.test(email) && passwordRegex.test(password)) {
            console.log('Login with:', email, password);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <img src={logo} alt="App Logo" className="app-logo" />
                <div>
                    <input
                        type="email"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={`input-field ${!emailValid ? 'invalid' : ''}`}
                    />
                    {!emailValid && <p className="error-message">Please enter a valid email address.</p>}

                </div>
                <div>
                    <input
                        type="password"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`input-field ${!passwordValid ? 'invalid' : ''}`}
                    />
                    {!passwordValid && <p className="error-message">Password must contain letters and numbers.</p>}
                </div>
                <GoogleLoginButton></GoogleLoginButton>
                <button className="login-button" type="submit">Login</button>
                <p className="signup-text">Don't have an account? Sign up.</p>
            </form>
        </div>
    );
};

export default LoginPage;
