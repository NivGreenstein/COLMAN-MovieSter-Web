import {IUser} from "../types/IUser";

const registerUser = async (payload: IUser) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export default {
    registerUser,
};