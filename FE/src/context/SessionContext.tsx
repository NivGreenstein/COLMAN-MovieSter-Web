import React, { createContext, useContext, useState } from 'react';

interface SessionContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

const defaultState: SessionContextType = {
    isLoggedIn: false,
    setIsLoggedIn: () => {},
};

export const SessionContext = createContext<SessionContextType>(defaultState);


export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <SessionContext.Provider value={{isLoggedIn, setIsLoggedIn }}>
            {children}
        </SessionContext.Provider>
    );
};
