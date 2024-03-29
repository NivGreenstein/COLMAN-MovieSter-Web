import { IBaseUser, IUser } from '../types/IUser';

const registerUser = async (payload: IBaseUser) => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/register`, {
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

const loginGoogle = async (code: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/login/google`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response;
};

export const logout = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/logout`, { method: 'POST', credentials: 'include' });
  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

const getCurrentUserData = async (): Promise<IUser> => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/users/me`, { method: 'GET', credentials: 'include' });
  if (!response.ok) {
    throw new Error('User not found');
  }
  const user: IUser = await response.json();
  return user;
};

const getNewAccessToken = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/token`, {
    method: 'GET',
    credentials: 'include',
  });
  return response;
};

export default {
  registerUser,
  loginUser,
  logout,
  getCurrentUserData,
  getNewAccessToken,
  loginGoogle,
};
