import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loader from '../helpers/Loader';
import DeleteModal from '../DeleteModal';

import '../../styles/user/User.css'
import EditUser from './EditUser';
import ModeratorMenu from '../helpers/ModeratorMenu';
import DepartmentCourses from '../courses/DepartmentCourses';
import TeacherCourses from './TeacherCourses';

const deleteMessage = "You are about to delete all information for this user."

const User = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userEntity, setUserEntity] = useState(null);
    const [collegeEntity, setCollegeEntity] = useState(null);
    const { user } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, [userId, user]);

    const loadUser = async () => {
        fetchUserDetails();
        fetchRelatedTeacher();
    }

    const fetchUserDetails = async () => {

        if (user && userId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserEntity(data);
                } else {
                    console.error('Failed to fetch user details:', response.status);
                }
            } catch (error) {
                console.error('Error during user fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchRelatedTeacher = async () => {
        if (user && userEntity && userEntity.role === "TEACHER") {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Teachers/${userId}?expand=courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCollegeEntity(data);
                } else {
                    console.error('Failed to fetch departement teachers:', response.status);
                }
            } catch (error) {
                console.error('Error during teachers fetch:', error);
            }
        }
    };


    const deleteUser = async () => {
        const departmentId = userEntity.department.id;
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Users/${userId}`, {
                    method: 'DELETE',
                    headers: headers,
                });
                if (response.status === 204) {
                    sessionStorage.setItem("toast", true);
                    navigate(`/departements/${departmentId}`, { replace: true, state: { fromDelete: true } });
                } else {
                    console.error('User deletion failed:', response.statusText);
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

    function toSentenceCase(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="userEntity-page">
                    <div className="userEntity-container">
                        <div className="userEntity-cover">
                        </div>
                        <div className="userEntity-details">
                            <div className="userEntity-details-title">
                                <h1>{userEntity.firstName} {userEntity.lastName}</h1>
                                <div className="userEntity-description"> {toSentenceCase(user.role)} </div>
                                <div className="userEntity-email">
                                    <i className="bi bi-envelope"></i>
                                    <span className="userEntity-email">{userEntity.email}</span>
                                </div>
                            </div>
                        </div>
                        {userEntity.role === "TEACHER" ?
                            <><TeacherCourses courses={userEntity.courses} />
                            </> : null}
                    </div>
                    {user.role === "ADMIN" ?
                        <div className="moderator-menu-container">
                            <ModeratorMenu openEdit={openEditMenu} openDelete={openDeleteMenu} />
                        </div> : null
                    }
                    <EditUser showModal={openEdit} onClose={closeEditMenu} initialUser={userEntity} fetchUser={fetchUserDetails} />

                    <DeleteModal showModal={openDelete} onClose={closeDeleteMenu} deleteEntity={deleteUser} deleteText={deleteMessage} />
                    <ToastContainer containerId={"userEntityToast"} />
                </div>
            )}
        </div>
    );
};

export default User;
