import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import DepartmentTile from './DepartmentTile';
import NewDepartment from './NewDepartment';

import '../../styles/department/FacultyDepartments.css';

const PAGE_SIZE = 9;

const FacultyDepartments = ({ facultyId }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewDepartmentModal, setShowNewDepartmentModal] = useState(false);


    useEffect(() => {
        fetchFacultyDepartments();
    }, [user, facultyId]);

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

    const fetchFacultyDepartments = async () => {
        if (user && facultyId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Departments?facultyId=${facultyId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartments(data);
                } else {
                    console.error('Failed to fetch faculty departments:', response.status);
                }
            } catch (error) {
                console.error('Error during departments fetch:', error);
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

    const filteredDepartments = departments.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedDepartments = filteredDepartments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const totalPages = Math.ceil(filteredDepartments.length / PAGE_SIZE);

    if (loading) {
        return <p>Loading departments...</p>;
    }

    const handleNewButtonClick = () => {
        setShowNewDepartmentModal(true)
    };

    const handleNewDepartmentModalClose = () => {
        setShowNewDepartmentModal(false)
    };


    return (
        <div>
            <div className="search-and-add-container">
                <input
                    className="search-departments"
                    type="text"
                    placeholder="Search departments"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button
                    className="add-department-button"
                    onClick={handleNewButtonClick}
                >
                    New Department
                </button>
            </div>
            <div className="departments-container">
                {paginatedDepartments.map((department) => (
                    <DepartmentTile key={department.id} department={department} />
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
            <NewDepartment showModal={showNewDepartmentModal} onClose={handleNewDepartmentModalClose} fetchDepartments={fetchFacultyDepartments} facultyId={facultyId} />
            <ToastContainer />
        </div>
    );
};

export default FacultyDepartments;