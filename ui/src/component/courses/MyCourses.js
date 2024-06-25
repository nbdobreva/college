import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../helpers/Loader';
import MyCourseTile from './MyCourseTile';
import '../../styles/course/MyCourses.css'
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 3;

const MyCourses = () => {
    const { user, userEntity } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (userEntity) {
            setCourses(userEntity.courses);
        }
    }, [user]);

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
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="search-and-add-container">
                <input
                    className="search-courses"
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
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

        </div>)
}

export default MyCourses;
