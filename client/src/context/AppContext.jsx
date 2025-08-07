'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AppContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
