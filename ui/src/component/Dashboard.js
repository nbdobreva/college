import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [upcomingEvent, setUpcomingEvent] = useState('');
    const [loading, setLoading] = useState(true);

    return (
        <div>
            <h2>Welcome, {user.firstName}! </h2>
        </div>
    );
};

export default Dashboard;