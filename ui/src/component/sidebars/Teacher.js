import React from 'react';
import { useAuth } from '../../context/AuthContext'

import '../../styles/Sidebar.css';
import { Link } from 'react-router-dom';

const Teacher = () => {
    const { userEntity } = useAuth();

    console.log(userEntity);
    return (
        <>
            {userEntity && userEntity.headOfDepartment ?
                <>
                    <li className="sidebar-menu-item">
                        <Link to={`/departments/${userEntity.headOfDepartment}`}>
                            <i className="bi bi bi-bank2 sidebar-icon"></i><p>My Department</p>
                        </Link>
                    </li>
                </> : null
            }
            <li className="sidebar-menu-item">
                <Link to='/my-courses'>
                    <i className="bi bi-journal sidebar-icon"></i><p>My Courses</p>
                </Link>
            </li>
        </>
    );
};

export default Teacher;
