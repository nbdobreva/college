import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/user/TeacherCourses.css';
import CourseTile from '../courses/CourseTile';

const PAGE_SIZE = 9;

const TeacherCourses = ({ courses }) => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState(courses);
    const [paginatedCourses, setPaginatedCourses] = useState(courses);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (courses) {
            const filtered = courses.filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setFilteredCourses(filtered);

            const paginated = filteredCourses.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
            );
            setPaginatedCourses(paginated);

            totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
        }
    }, [searchTerm]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="teacher-courses">
            <div className="search-and-add-container">
                <input
                    className="search-courses"
                    type="text"
                    placeholder="Search courses"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {courses ?
                <div>
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
                </div> : null}
        </div>
    );
};

export default TeacherCourses;