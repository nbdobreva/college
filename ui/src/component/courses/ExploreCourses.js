import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/course/Courses.css'
import 'react-toastify/dist/ReactToastify.css';
import CourseTile from './CourseTile';

const PAGE_SIZE = 12;

const ExploreCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, [user]);

    const fetchCourses = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Courses`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    const courses = data.sort((a, b) => a.name.localeCompare(b.name));
                    setCourses(courses);
                } else {
                    console.error('Failed to fetch courses:', response.status);
                }
            } catch (error) {
                console.error('Error during courses fetch:', error);
            }
        }
    };

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
                    <CourseTile course={course} />
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

export default ExploreCourses;
