import { IUser } from '../types/IUser';

const getUserById = async (id: string): Promise<IUser> => {
  const response = await fetch(`${import.meta.env.VITE_API_URI}/users/${id}`, {
    credentials: 'include',
    method: 'GET',
  });
  const user = (await response.json()) as IUser;
  return user;
};

export { getUserById };
