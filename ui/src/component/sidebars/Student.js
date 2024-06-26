import React from 'react';

import '../../styles/Sidebar.css';
import { Link } from 'react-router-dom';

const Student = () => {

    return (
        <>
            <li className="sidebar-menu-item">
                <Link to='/my-courses'>
                    <i className="bi bi-journal sidebar-icon"></i><p>My Courses</p>
                </Link>
            </li>
            <li className="sidebar-menu-item inactive" />
            <li className="sidebar-menu-item inactive" />

            <li className="sidebar-menu-item explore">
                <Link to='/explore'>
                    <i className="bi bi-search sidebar-icon"></i><p>Explore</p>
                </Link>
            </li>
        </>
    );
};

export default Student;
