"use client";
import { API_URL } from '@/utils/api';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    // Check if the user is logged in on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify the token with the server (optional)
            verifyTokenAndSetUser(token)
        }
        else {
            setUser(null);
        }
    }, []);

    const verifyTokenAndSetUser = async (token) =>
        verifyToken(token)
        .then(msg => {
            if (msg) {
                return getUser(msg.userId);
            } else {
                throw new Error("error");
            }
        })
        .then(user => {setUser(user); return true})
        .catch(error => {
            setUser(null)
            console.log(error);
            return false;
        })

    const getUser = async (userId) => {
        const res = await fetch(`${API_URL}/users/${userId}`);
        const obj = await res.json();
        return obj;
    }

    const login = async (token) => {
        verifyTokenAndSetUser(token)
        .then((valid) => {
            if (valid){
                localStorage.setItem('token', token);
            }
            window.location.href="/account";
        })
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Function to verify the token with the server
const verifyToken = async (token) => {
    try {
        const response = await fetch(`${API_URL}/users/verify-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status >= 200 && response.status < 300){
            return data.user;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log('Token verification failed:', error);
        return null;
    }
};