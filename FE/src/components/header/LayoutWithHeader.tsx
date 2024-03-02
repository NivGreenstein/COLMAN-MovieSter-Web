import React from 'react';
import { useSession } from "../../context/SessionContext";
import AppHeader from './AppHeader';

const LayoutWithHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useSession();

    return (
        <div>
            {isLoggedIn && <AppHeader />}
            <div>{children}</div>
        </div>
    );
};

export default LayoutWithHeader;
