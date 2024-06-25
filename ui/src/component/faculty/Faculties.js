import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../helpers/Loader';
import FacultyTile from './FacultyTile';
import '../../styles/faculty/Faculties.css'
import NewFaculty from './NewFaculty';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const PAGE_SIZE = 6;

const Faculties = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFaculties();
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
    }, [user, location.state]);

    const fetchFaculties = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Faculties`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    const faculties = data.sort((a, b) => a.name.localeCompare(b.name));
                    setFaculties(faculties);
                } else {
                    console.error('Failed to fetch faculties:', response.status);
                }
            } catch (error) {
                console.error('Error during faculties fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredFaculties = faculties.filter((faculty) =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedFaculties = filteredFaculties.slice(
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

    const totalPages = Math.ceil(filteredFaculties.length / PAGE_SIZE);

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
                    className="search-faculties"
                    type="text"
                    placeholder="Search faculties..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button
                    className="add-faculty-button"
                    onClick={handleNewButtonClick}
                >
                    Add Faculty
                </button>
            </div>
            <div className="faculties-container">
                {paginatedFaculties.map((faculty) => (
                    <FacultyTile faculty={faculty} />
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
            <NewFaculty showModal={showModal} onClose={handleModalClose} fetchFaculties={fetchFaculties} />
            <ToastContainer />
        </div>)
}

export default Faculties;
