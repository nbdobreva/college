import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/user/Users.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from 'react-router-dom';
import NewUser from './NewUser';

const PAGE_SIZE = 20;

const Users = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [userCategory, setUserCategory] = useState('');

    useEffect(() => {
        fetchUsers();
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

    const fetchUsers = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Users`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    const users = data.sort((a, b) => a.lastName.localeCompare(b.lastName));
                    setUsers(users);
                } else {
                    console.error('Failed to fetch users:', response.status);
                }
            } catch (error) {
                console.error('Error during users fetch:', error);
            }
        }
    };

    const handleUserCategoryChange = (category) => {
        setUserCategory(category);
    };

    const filteredUsers = users.filter((userEntity) =>
        (userEntity.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || userEntity.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        userEntity.role.includes(userCategory)
    );

    const paginatedUsers = filteredUsers.slice(
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

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

    const handleNewButtonClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="search-and-add-container">
                <div className="search-and-category">
                    <input
                        className="search-users"
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="category-buttons">
                        <button
                            className={`category-button ${userCategory === '' ? 'active' : ''}`}
                            onClick={() => handleUserCategoryChange('')}
                        >
                            All
                        </button>
                        <button
                            className={`category-button ${userCategory === 'TEACHER' ? 'active' : ''}`}
                            onClick={() => handleUserCategoryChange('TEACHER')}
                        >
                            Teachers
                        </button>
                        <button
                            className={`category-button ${userCategory === 'STUDENT' ? 'active' : ''}`}
                            onClick={() => handleUserCategoryChange('STUDENT')}
                        >
                            Students
                        </button>
                    </div>
                </div>
                <button
                    className="add-userEntity-button"
                    onClick={handleNewButtonClick}
                >
                    Add User
                </button>
            </div>
            <div className="users-container">
                {paginatedUsers.map((userEntity) => (
                    <Link to={`/users/${userEntity.id}`} className="user-entry" >
                        {userEntity.firstName} {userEntity.lastName}
                    </Link>
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
            <NewUser showModal={showModal} onClose={handleModalClose} fetchUsers={fetchUsers} />
            <ToastContainer />
        </div>)
}

export default Users;
