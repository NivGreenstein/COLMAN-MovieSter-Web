import {IUser} from "../types/IUser";

const registerUser = async (payload: IUser) => {
    const response = await fetch("http://localhost:8080/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Server error during registration');
    }

    const data = await response.json();
    return data;
};

const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8080/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }
    // Here you might want to store the login token received from the server
    return response;
};

export const checkSession = async () => {
    const response = await fetch('/api/check-session'); // Your endpoint to verify session
    return response.ok;
};

export const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
};

export default {
    registerUser,
    loginUser,
    checkSession,
    logout
};