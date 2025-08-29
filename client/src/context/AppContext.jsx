'use client';

import { getCookie, deleteCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authMethod, setAuthMethod] = useState(null); // 'jwt' or 'oauth'

    const { data: session, status } = useSession();

    const getUserFromToken = () => {
        try {
            const token = getCookie('token');
            if (token) {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLoggedIn(true);
                setAuthMethod('jwt');
                return decoded;
            }
            // If there's no JWT token, do NOT reset state here.
            // This avoids wiping out an active OAuth session during client navigation.
            return null;
        } catch (error) {
            console.error('Error decoding token:', error);
            // On decode error, avoid clearing existing session-derived state.
            return null;
        }
    };

    const getUserData = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`);
            console.log('Fetched user data:', res.data);
            setUserData(res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Handle NextAuth session changes
    useEffect(() => {
        if (status === 'loading') return;

        if (session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
            setAuthMethod('oauth');
            setIsLoading(false);
        } else if (status === 'unauthenticated') {
            // Check for JWT token if no OAuth session
            const jwtUser = getUserFromToken();
            if (!jwtUser) {
                setUser(null);
                setIsLoggedIn(false);
                setAuthMethod(null);
                setIsLoading(false);
            }
        }
    }, [session, status]);

    // Auto-load user data when component mounts
    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            const userData = getUserFromToken();
            setIsLoading(false);
        }
    }, [session, status]);

    const logout = async () => {
        if (authMethod === 'oauth') {
            // Sign out from NextAuth
            await signOut({ callbackUrl: '/' });
        } else {
            // Clear JWT cookies and reset state
            deleteCookie('token');
            deleteCookie('userId');
        }
        
        setUser(null);
        setUserData([]);
        setIsLoggedIn(false);
        setAuthMethod(null);
        
        // Redirect to home
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
            logout,
            authMethod,
            session
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
