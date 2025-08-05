'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState('biswa');
    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
