import {IUser} from '../types/IUser';

const getUserById = async (id: string): Promise<IUser> => {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/users/${id}`, {
        credentials: 'include',
        method: 'GET',
    });
    const user = (await response.json()) as IUser;
    return user;
};


const updateUser = async (userData: FormData): Promise<any> => {
    const response = await fetch(`${import.meta.env.VITE_API_URI}/users`, {
        method: 'PATCH',
        credentials: 'include',
        body: userData,
    });

    if (!response.ok) {
        throw new Error('Could not update user profile');
    }

    return;
};

export {getUserById, updateUser};
