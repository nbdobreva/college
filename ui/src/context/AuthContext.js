import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const initialize = (() => localStorage.getItem('Authentication') && localStorage.getItem('user'))();

    const [isAuthenticated, setIsAuthenticated] = useState(initialize ? true : null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(initialize ? localStorage.getItem('user') : null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('Authentication');
            if (token) {
                try {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    setIsAuthenticated(true);
                    setUser(userData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }

            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const setAuthData = ({ isAuthenticated, user }) => {
        setIsAuthenticated(isAuthenticated);
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthData, loading, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};