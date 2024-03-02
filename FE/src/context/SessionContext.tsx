import React, {createContext, useContext, useEffect, useState} from 'react';

interface SessionContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

const defaultState: SessionContextType = {
    isLoggedIn: false,
    setIsLoggedIn: () => {
    },
};

export const SessionContext = createContext<SessionContextType>(defaultState);


export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({children}) => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [isLoading, setIsLoading] = useState(true);


        useEffect(() => {
            const refreshAccessToken = async () => {
                try {
                    const response = await fetch('http://localhost:8080/token', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    setIsLoggedIn(response.ok);
                } catch (error) {
                    console.error('Failed to refresh access token', error);
                    setIsLoggedIn(false);
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
            <SessionContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
                {children}
            </SessionContext.Provider>
        );
    }
;
