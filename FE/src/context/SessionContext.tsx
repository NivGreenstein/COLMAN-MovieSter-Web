import React, { createContext, useContext, useState } from 'react';

export const SessionContext = createContext(null);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/check-session');
            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    };

    return (
        <SessionContext.Provider value={{ isLoggedIn, checkSession }}>
            {children}
        </SessionContext.Provider>
    );
};
