import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MyCourseTile from './MyCourseTile';
import NewCourse from './NewCourse';

import '../../styles/course/MyCourses.css'
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 3;

const MyCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewCourseModal, setShowNewCourseModal] = useState(false);
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        if (user) {
            fetchMyCourses();
        }
    }, [user]);

    const fetchMyCourses = async () => {
        if (user) {
            const endpoint = user.role === "TEACHER" ? "Teachers" : "Students";
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/${endpoint}?userId=${user.id}&expand`, {
                    method: 'GET',
                    headers: headers,
                });

                if (response.ok) {
                    const data = await response.json();
                    setEntity(data);
                    setCourses(data.courses);
                } else {
                    console.error('Failed to fetch entity:', response.status);
                }
            } catch (error) {
                console.error('Error during entity fetch:', error);
            }
        }
    }
    console.log("in courses");


    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);

    const handleNewButtonClick = () => {
        setShowNewCourseModal(true);
    };

    const handleModalClose = () => {
        setShowNewCourseModal(false);
    };

    return (entity ?
        <div>
            <div className="search-and-add-container">
                <input
                    className="search-courses"
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                {user && user.role === "TEACHER" ?
                    <button
                        className="add-course-button"
                        onClick={handleNewButtonClick}
                    >
                        New Course
                    </button> : null}
            </div>
            <div className="courses-container">
                {paginatedCourses.map((course) => (
                    <MyCourseTile course={course} />
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
            {user && user.role === "TEACHER" ?
                <NewCourse showModal={showNewCourseModal}
                    onClose={handleModalClose}
                    fetchCourses={fetchMyCourses}
                    departmentId={entity.department.id}
                    teachers={[entity]}
                    isFromMyCourses={true}
                    userEntityId={entity.id} /> : null}
        </div> : null)
}

export default MyCourses;
