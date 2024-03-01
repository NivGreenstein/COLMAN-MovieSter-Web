import React, { createContext, useContext, useState } from 'react';

export const SessionContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </SessionContext.Provider>
    );
};
