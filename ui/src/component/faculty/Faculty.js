import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ModeratorMenu from '../helpers/ModeratorMenu';
import Loader from '../helpers/Loader';
import DeleteModal from '../DeleteModal';
import EditFaculty from './EditFaculty';
import FacultyDepartments from '../department/FacultyDepartments';

import '../../styles/faculty/Faculty.css'
import 'react-toastify/dist/ReactToastify.css';

const deleteMessage = "You are about to delete all information for this faculty. Its related departments will also be removed."

const Faculty = () => {
    const { facultyId } = useParams();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faculty, setFaculty] = useState();
    const { user } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFacultyDetails();
    }, [facultyId, user]);

    const fetchFacultyDetails = async () => {
        if (user && facultyId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Faculties/${facultyId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFaculty(data);
                } else {
                    console.error('Failed to fetch faculty details:', response.status);
                }
            } catch (error) {
                console.error('Error during faculties fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const deleteFaculty = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Faculties/${facultyId}`, {
                    method: 'DELETE',
                    headers: headers,
                });
                if (response.status === 204) {
                    sessionStorage.setItem("toast", true);
                    navigate('/faculties', { replace: true, state: { fromDelete: true } });
                } else {
                    console.error('Faculty deletion failed:', response.statusText);
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


    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="faculty-page">
                    <div className="faculty-container">
                        <div className="faculty-cover">
                        </div>
                        <div className="faculty-details">
                            <div className="faculty-details-title">
                                <h1>{faculty.name}</h1>
                            </div>
                            <div className="faculty-description"> {faculty.description} </div>
                        </div>
                        <FacultyDepartments facultyId={facultyId} />
                    </div>
                    {user.role === "ADMIN" ?
                        <div className="moderator-menu-container">
                            <ModeratorMenu openEdit={openEditMenu} openDelete={openDeleteMenu} />
                        </div> : null
                    }
                    <ToastContainer containerId={"facultyToast"} />
                    <EditFaculty showModal={openEdit} onClose={closeEditMenu} initialFaculty={faculty} fetchFaculty={fetchFacultyDetails} />
                    <DeleteModal showModal={openDelete} onClose={closeDeleteMenu} deleteEntity={deleteFaculty} deleteText={deleteMessage} />
                </div>
            )}
        </div>
    );
};

export default Faculty;
