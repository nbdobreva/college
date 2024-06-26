import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';

import '../../styles/ModeratorMenu.css'

const StudentCourseSideMenu = ({ courseId, students }) => {
    const { user } = useAuth();
    const [student, setStudent] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(null);

    useEffect(() => {
        fetchStudent();
    }, [user]);

    const fetchStudent = async () => {
        if (user) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Students?userId=${user.id}&expand`, {
                    method: 'GET',
                    headers: headers,
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudent(data);
                    setIsEnrolled(data.courses.some(c => c.id === courseId));
                } else {
                    console.error('Failed to fetch student:', response.status);
                }
            } catch (error) {
                console.error('Error during student fetch:', error);
            }
        }
    }

    const handleEnrollClick = () => {
        patchCourse(isEnrolled ? "REMOVE" : "ADD");
    }

    console.log(isEnrolled);

    const patchCourse = async (op) => {
        if (user) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Courses/${courseId}/students`, {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify({
                        studentId: student.id,
                        op: op
                    }),
                });

                if (response.status === 204) {
                    setIsEnrolled(!isEnrolled);
                } else {
                    console.error('Failed to patch course:', response.status);
                }
            } catch (error) {
                console.error('Error during course patch:', error);
            }
        }
    }

    return (student ?
        <div>
            <div className="moderator-menu-container">
                <div className="moderator-tab"></div>
                <div
                    className={`moderator-menu view-menu ${isEnrolled ? 'disabled' : ''}`}
                    onClick={handleEnrollClick}
                >
                    {isEnrolled ? 'Already Enrolled' : 'Enroll Me'}
                </div>
            </div>
        </div> : null
    )
}

export default StudentCourseSideMenu;