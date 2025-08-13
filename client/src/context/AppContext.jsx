'use client';

import { getCookie } from 'cookies-next';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [userData, setUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const getUserFromToken = () => {
        const token = getCookie('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
            setIsLoggedIn(true);
            return decoded;
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
    };
    const getUserData = async (id) => {
        const res = await axios.get('/api/users/getUserById', { params: { id } });
        setUserData(res.data);
        return res.data;
    };
    return (
        <AppContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, getUserFromToken, getUserData, userData }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
