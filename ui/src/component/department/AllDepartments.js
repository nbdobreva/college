import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../helpers/Loader';
import '../../styles/department/Departments.css'
import DepartmentTile from './DepartmentTile';
import NewDepartment from './NewDepartment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 9;

const Departments = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchDepartments();

    }, [user]);

    const fetchDepartments = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Departments`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    const departments = data.sort((a, b) => a.name.localeCompare(b.name));
                    setDepartments(departments);
                } else {
                    console.error('Failed to fetch departments:', response.status);
                }
            } catch (error) {
                console.error('Error during departments fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredDepartments = departments.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedDepartments = filteredDepartments.slice(
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

    const totalPages = Math.ceil(filteredDepartments.length / PAGE_SIZE);

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
                    className="search-departments"
                    type="text"
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button
                    className="add-department-button"
                    onClick={handleNewButtonClick}
                >
                    Add Department
                </button>
            </div>
            <div className="departments-container">
                {paginatedDepartments.map((department) => (
                    <DepartmentTile department={department} />
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
            <NewDepartment showModal={showModal} onClose={handleModalClose} fetchDepartments={fetchDepartments} />
            <ToastContainer />
        </div>)
}

export default Departments;
