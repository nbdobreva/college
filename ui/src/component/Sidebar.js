import React from 'react';

import '../styles/Sidebar.css'
import { useAuth } from '../context/AuthContext';
import Student from './sidebars/Student';
import Admin from './sidebars/Admin';
import Teacher from './sidebars/Teacher';


const Sidebar = () => {
    const { user } = useAuth();

    const logout = async () => {
        localStorage.clear();
        window.location.reload()
    }

    return (
        <div className='sidebar'>
            <ul className='sidebar'>
                <li className="sidebar-menu-item">
                    <a href='/dashboard'>
                        <i className="bi bi-grid sidebar-icon" /><p>Dashboard</p>
                    </a>
                </li>
                {user && user.role === "ADMIN" ? <Admin /> : null}
                {user && user.role === "TEACHER" ?
                    <Teacher />
                    : null}
                {user && user.role === "STUDENT" ?
                    <Student /> : null}
                <li className="separate-sidebar sidebar-menu-item">
                    <a onClick={logout}>
                        <i className="bi bi-box-arrow-right sidebar-icon" /><p>Logout</p>
                    </a>
                </li>
            </ul>
        </div >
    );
};

export default Sidebar;
