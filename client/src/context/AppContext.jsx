'use client';

import { getCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getUserFromToken = () => {
        try {
            const token = getCookie('token');
            if (token) {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLoggedIn(true);
                return decoded;
            } else {
                setUser(null);
                setIsLoggedIn(false);
                return null;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setUser(null);
            setIsLoggedIn(false);
            return null;
        }
    };

    const getUserData = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`);
            setUserData(res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Auto-load user data when component mounts
    useEffect(() => {
        const initializeUser = () => {
            const userData = getUserFromToken();
            setIsLoading(false);
        };

        initializeUser();
    }, []);

    const logout = () => {
        // Clear cookies and reset state
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUser(null);
        setUserData([]);
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            isLoggedIn,
            setIsLoggedIn,
            getUserFromToken,
            getUserData,
            userData,
            isLoading,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
