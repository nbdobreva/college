import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'
import Loader from './helpers/Loader';

const Dashboard = () => {
    const { user, loading } = useAuth();

    useEffect(() => {
    }, [user, loading]);


    console.log(user);
    return (
        <>
            {!user ?
                <Loader /> :
                <div>
                    <h2>Welcome, {user.firstName}! </h2>
                </div>
            }</>
    );
};

export default Dashboard;