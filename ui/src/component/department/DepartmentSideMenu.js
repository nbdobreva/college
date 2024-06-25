import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';

import '../../styles/ModeratorMenu.css'

const DepartmentSideMenu = ({ openEdit, openDelete, openManageTeachers, userRole, teachers, departmentId }) => {
    const { userEntity } = useAuth();

    const [showTeachers, setShowTeachers] = useState(false);
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        if (teachers) {
            const filtered = teachers.filter(teacher =>
                teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setFilteredTeachers(filtered);
        }
    }, [searchQuery, teachers]);


    return (userRole === "ADMIN" || (userRole === "TEACHER" && userEntity.headOfDepartment === departmentId) ?
        <div className="moderator-menu-container">
            <div className="moderator-tab">
                <div
                    className="moderator-menu view-menu"
                    onClick={(e) => showTeachers ? setShowTeachers(false) : setShowTeachers(true)}
                    style={showTeachers ? { "background": "#F5F6F7", "borderBottom": "none" } : {}} >Department Teachers</div>
                {showTeachers ?
                    <div className="view-search-menu">
                        <input
                            type="text"
                            placeholder="Search teachers"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-menu"
                        />
                        <div className="menu-divider">
                            <div className="divider-line" />
                        </div>
                        <div className="menu-list">
                            {filteredTeachers.map((teacher, index) => (
                                <li key={index} className="menu-line">
                                    <div className="user">
                                        {teacher.firstName} {teacher.lastName}
                                    </div>
                                </li>

                            ))}
                        </div>
                        <div className="manage-menu-button" onClick={openManageTeachers}>+ Manage Teachers</div>
                    </div> : null
                }
                <div className="moderator-menu" onClick={openEdit}><i className="bi bi-pencil moderator-icon" /> Edit </div>
                <div className="moderator-menu" onClick={openDelete}><i className="bi bi-x-lg moderator-icon" />Delete</div>
            </div>
        </div> : null
    )
}

export default DepartmentSideMenu;