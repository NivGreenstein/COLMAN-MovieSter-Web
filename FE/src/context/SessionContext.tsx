import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../types/IUser';
import authService from '../services/auth.service';

interface SessionContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  loggedUser: IUser | null;
  setLoggedUser: (value: IUser | null) => void;
}

const defaultState: SessionContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loggedUser: null,
  setLoggedUser: () => {},
};

export const SessionContext = createContext<SessionContextType>(defaultState);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState<IUser | null>(null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await authService.getNewAccessToken();
        setIsLoggedIn(response.ok);
        if (response.ok) {
          const user = await authService.getCurrentUserData();
          setLoggedUser(user);
        }
      } catch (error) {
        console.error('Failed to refresh access token', error);
        setIsLoggedIn(false);
        setLoggedUser(null);
      } finally {
        setIsLoading(false); // Update loading state after the attempt
      }
    };

    refreshAccessToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn, loggedUser, setLoggedUser }}>
      {children}
    </SessionContext.Provider>
  );
};
