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
    const response = await fetch(`${import.meta.env.VITE_API_URI}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response;
};

export const logout = async () => {
    const response = await fetch('http://localhost:8080/logout', { method: 'POST', credentials: 'include' });
    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

export default {
    registerUser,
    loginUser,
    logout
};