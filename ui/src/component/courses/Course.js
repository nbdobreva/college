import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loader from '../helpers/Loader';
import DeleteModal from '../DeleteModal';

import '../../styles/course/Course.css'
import EditCourse from './EditCourse';
import ModeratorCourseSideMenu from './ModeratorCourseSideMenu';
import StudentCourseSideMenu from './StudentCourseSideMenu';

const deleteMessage = "You are about to delete all information for this course."

const Course = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [areStudentsLoaded, setAreStudentsLoaded] = useState(false);
    const [course, setCourse] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [courseTeacherId, setCourseTeacherId] = useState("");

    const [students, setStudents] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCourse();
    }, [courseId, user]);

    const loadCourse = async () => {
        fetchCourseDetails();
        fetchDepartmentTeachers();
        fetchStudents();
    }

    const fetchCourseDetails = async () => {
        if (user && courseId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Courses/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourse(data);
                    if (data.teacher) {
                        setCourseTeacherId(data.teacher.id);
                    }
                } else {
                    console.error('Failed to fetch course details:', response.status);
                }
            } catch (error) {
                console.error('Error during course fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchDepartmentTeachers = async () => {
        if (user && course) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Teachers?departmentId=${course.department.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTeachers(data);
                } else {
                    console.error('Failed to fetch departement teachers:', response.status);
                }
            } catch (error) {
                console.error('Error during teachers fetch:', error);
            }
        }
    };

    const fetchStudents = async () => {
        if (user && course) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Courses/${courseId}/students`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                    setAreStudentsLoaded(true);
                } else {
                    console.error('Failed to fetch departement teachers:', response.status);
                }
            } catch (error) {
                console.error('Error during teachers fetch:', error);
            }
        }
    };

    const deleteCourse = async () => {
        const departmentId = course.department.id;
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Courses/${courseId}`, {
                    method: 'DELETE',
                    headers: headers,
                });
                if (response.status === 204) {
                    sessionStorage.setItem("toast", true);
                    navigate(`/departements/${departmentId}`, { replace: true, state: { fromDelete: true } });
                } else {
                    console.error('Course deletion failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during deletion request:', error);
            }
        }
    };

    const openEditMenu = () => {
        setOpenEdit(true);
    };

    const closeEditMenu = () => {
        setOpenEdit(false);
    };

    const openDeleteMenu = () => {
        setOpenDelete(true);
    };

    const closeDeleteMenu = () => {
        setOpenDelete(false);
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="course-page">
                    <div className="course-page-container">
                        <div className="course-page-cover">
                        </div>
                        <div className="course-page-details">
                            <div className="course-page-details-title">
                                <h1>{course.name}</h1>
                                <div className="course-page-description"> {course.description} </div>
                                {course.teacher ? (
                                    <div className="course-page-teacher">
                                        <i className="bi bi-person-workspace"></i>
                                        <Link to={`/users/${course.teacher.userId}`} className="course-page-teacher-link">
                                            {course.teacher.firstName} {course.teacher.lastName}
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {(user && user.role === "STUDENT") ?
                        <StudentCourseSideMenu
                            courseId={courseId}
                            students={students} /> :
                        <ModeratorCourseSideMenu
                            openEdit={openEditMenu}
                            openDelete={openDeleteMenu}
                            isCourseTeacher={user.id === courseTeacherId}
                            userRole={user.role}
                            courseId={courseId}
                            students={students} />
                    }
                    <EditCourse showModal={openEdit} onClose={closeEditMenu} initialCourse={course} fetchCourse={fetchCourseDetails} />

                    <DeleteModal showModal={openDelete} onClose={closeDeleteMenu} deleteEntity={deleteCourse} deleteText={deleteMessage} />
                    <ToastContainer containerId={"courseToast"} />
                </div>
            )}
        </div>
    );
};

export default Course;
