import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';

import '../../styles/ModeratorMenu.css'

const CourseSideMenu = ({ openEdit, openDelete, isCourseTeacher, userRole, courseId, students }) => {
    const { user, student } = useAuth();
    const [showStudents, setShowStudents] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState(students);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        if (user.role === "STUDENT") {
            setIsEnrolled(student.courses.some(c => c.id === courseId));
        }

        if (students) {
            const filtered = students.filter(s =>
                s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setFilteredStudents(filtered);
        }
    }, [searchQuery, user]);

    const handleEnrollClick = (e) => {
        if (!isEnrolled) {

        }
    };

    return (userRole === "ADMIN" || isCourseTeacher ?
        <div className="moderator-menu-container">
            <div className="moderator-tab">
                <div
                    className="moderator-menu view-menu"
                    onClick={(e) => showStudents ? setShowStudents(false) : setShowStudents(true)}
                    style={showStudents ? { "background": "#F5F6F7", "borderBottom": "none" } : {}} >Enrolled Students</div>
                {showStudents ?
                    <div className="view-search-menu">
                        <input
                            type="text"
                            placeholder="Search students"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-menu"
                        />
                        <div className="menu-divider">
                            <div className="divider-line" />
                        </div>
                        <div className="menu-list">
                            {filteredStudents.map((teacher, index) => (
                                <li key={index} className="menu-line">
                                    <div className="user">
                                        {teacher.firstName} {teacher.lastName}
                                    </div>
                                </li>

                            ))}
                        </div>
                        <div className="manage-menu-button">Manage</div>
                    </div> : null
                }
                <div className="moderator-menu" onClick={openEdit}><i className="bi bi-pencil moderator-icon" /> Edit </div>
                <div className="moderator-menu" onClick={openDelete}><i className="bi bi-x-lg moderator-icon" />Delete</div>
            </div>
        </div> : userRole === "STUDENT" ?
            <div>
                <div className="moderator-menu-container">
                    <div className="moderator-tab"></div>
                    <div
                        className={`moderator-menu view-menu ${isEnrolled ? 'disabled' : ''}`}
                        onClick={handleEnrollClick}
                        style={showStudents ? { background: "#F5F6F7", borderBottom: "none" } : {}}
                    >
                        {isEnrolled ? 'Already Enrolled' : 'Enroll Me'}
                    </div>
                </div>
            </div> : null
    )
}

export default CourseSideMenu;