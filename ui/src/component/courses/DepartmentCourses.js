import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

import '../../styles/course/DepartmentCourses.css';
import CourseTile from './CourseTile';
import NewCourse from './NewCourse';

const PAGE_SIZE = 9;

const DepartmentCourses = ({ departmentId, departmentHeadId, teachers }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewCourseModal, setShowNewCourseModal] = useState(false);

    useEffect(() => {
        fetchDepartmentCourses();
    }, [user, departmentId]);

    useEffect(() => {
        if (location.state?.fromDelete) {
            toast('Faculty is deleted.', {
                position: 'bottom-center',
                autoClose: 10000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: 'light',
                bodyClassName: "toast-class"
            });
        }
    }, [location.state]);

    const fetchDepartmentCourses = async () => {
        if (user && departmentId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Courses?departmentId=${departmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error('Failed to fetch department courses:', response.status);
                }
            } catch (error) {
                console.error('Error during courses fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

    if (loading) {
        return <p>Loading courses...</p>;
    }

    const handleNewButtonClick = () => {
        setShowNewCourseModal(true)
    };

    const handleNewCourseModalClose = () => {
        setShowNewCourseModal(false)
    };

    return (
        <div>
            <div className="search-and-add-container">
                <input
                    className="search-courses"
                    type="text"
                    placeholder="Search courses"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                {user && (user.id === departmentHeadId || user.role === "ADMIN")}
                <button
                    className="add-course-button"
                    onClick={handleNewButtonClick}
                >
                    New Course
                </button>
            </div>
            <div className="courses-container">
                {paginatedCourses.map((course) => (
                    <CourseTile key={course.id} course={course} />
                ))}
            </div>
            <div>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        className={`pagination ${currentPage === page ? 'current' : ''}`}
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <NewCourse showModal={showNewCourseModal}
                onClose={handleNewCourseModalClose}
                fetchCourses={fetchDepartmentCourses}
                departmentId={departmentId}
                teachers={teachers}
                isFromMyCourses={false} />
            <ToastContainer />
        </div>
    );
};

export default DepartmentCourses;