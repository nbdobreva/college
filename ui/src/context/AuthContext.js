import React, { createContext, useState, useEffect, useContext } from 'react';
import { json } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userEntity, setUserEntity] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('Authentication');
            const userData = localStorage.getItem('User');
            const userEntityData = localStorage.getItem("Entity");

            if (token && userData) {
                try {
                    const parsedUserData = JSON.parse(userData);
                    setIsAuthenticated(true);
                    setUser(parsedUserData);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }

            if (userEntityData) {
                try {
                    const parsedUserEntityData = JSON.parse(userEntityData);
                    setUserEntity(parsedUserEntityData);
                }
                catch (error) {
                    console.error('Error parsing userEntity data:', error);
                    setUserEntity(null);
                }
            }

            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const setAuthData = (authData) => {
        const { isAuthenticated, user } = authData;
        setIsAuthenticated(isAuthenticated);
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthData, loading, user, setUser, userEntity }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};