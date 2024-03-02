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
    credentials: 'include',
    headers: {

    if (!response.ok) {
        throw new Error('Login failed');
    }
    // Here you might want to store the login token received from the server
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