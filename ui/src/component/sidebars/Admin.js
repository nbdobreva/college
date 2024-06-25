import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Sidebar.css';

const Admin = () => {
    return (
        <div>
            <li className="sidebar-menu-item">
                <Link to='/faculties'>
                    <i className="bi bi-bank sidebar-icon"></i><p>Faculties</p>
                </Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to='/departments'>
                    <i className="bi bi-bank2 sidebar-icon"></i><p>Departments</p>
                </Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to='/users'>
                    <i className="bi bi-people sidebar-icon"></i><p>Users</p>
                </Link>
            </li>
        </div>
    );
};

export default Admin;
