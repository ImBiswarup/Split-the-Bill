'use client';

import { getCookie } from 'cookies-next';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);
import { jwtDecode } from "jwt-decode";

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const getUserFromToken = () => {
        const token = getCookie('token');
        if (token) {
            const decoded = jwtDecode(token);
            console.log('Decoded user from token:', decoded);
            setUser(decoded);
            setIsLoggedIn(true);
        } else {
            console.log('No token found, user is not logged in.');
            setUser(null);
            setIsLoggedIn(false);
        }
    };
    return (
        <AppContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, getUserFromToken }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
