import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loader from '../helpers/Loader';
import DeleteModal from '../DeleteModal';
import DepartmentCourses from '../courses/DepartmentCourses';
import EditDepartment from './EditDepartment';

import '../../styles/department/Department.css'
import DepartmentSideMenu from './DepartmentSideMenu';
import ManageDepartmentTeachers from './ManageDepartmentTeachers';

const deleteMessage = "You are about to delete all information for this department and its related courses will be removed."

const Department = () => {
    const { departmentId } = useParams();
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [teachersWithoutDepartment, setTeachersWithoutDepartment] = useState([]);
    const [departmentHeadId, setDepartmentHeadId] = useState("");
    const { user } = useAuth();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openManageTeachers, setOpenManageTeachers] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadDepartment();
    }, [departmentId, user]);

    const loadDepartment = async () => {
        fetchDepartmentDetails();
        fetchTeachers();
        fetchAllTeachers();
    }
    const fetchDepartmentDetails = async () => {
        if (user && departmentId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Departments/${departmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartment(data);
                    if (data.headTeacher) {
                        setDepartmentHeadId(data.headTeacher.id);
                    }
                } else {
                    console.error('Failed to fetch department details:', response.status);
                }
            } catch (error) {
                console.error('Error during department fetch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchTeachers = async () => {
        if (user) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Teachers?departmentId=${departmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTeachers(data);
                } else {
                    console.error('Failed to fetch departement teachers:', response.status);
                }
            } catch (error) {
                console.error('Error during teachers fetch:', error);
            }
        }
    };

    const fetchAllTeachers = async () => {
        if (user) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Teachers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const filtered = data.filter((teacher) => !teacher.department);
                    setTeachersWithoutDepartment(filtered);
                } else {
                    console.error('Failed to fetch departement teachers:', response.status);
                }
            } catch (error) {
                console.error('Error during teachers fetch:', error);
            }
        }
    }

    const deleteDepartment = async () => {
        const facultyId = department.faculty.id;
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Departments/${departmentId}`, {
                    method: 'DELETE',
                    headers: headers,
                });
                if (response.status === 204) {
                    sessionStorage.setItem("toast", true);
                    navigate(`/faculties/${facultyId}`, { replace: true, state: { fromDelete: true } });
                } else {
                    console.error('Department deletion failed:', response.statusText);
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

    const openManageTeacherMenu = () => {
        setOpenManageTeachers(true);
    };

    const closeManageTeacherMenu = () => {
        setOpenManageTeachers(false);
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="department-page">
                    <div className="department-container">
                        <div className="department-cover">
                        </div>
                        <div className="department-details">
                            <div className="department-details-title">
                                <h1>{department.name}</h1>
                                <div className="department-description"> {department.description} </div>
                                {department.headTeacher ? (
                                    <div className="department-head">
                                        <i className="bi bi-mortarboard-fill"></i>
                                        <Link to={`/users/${department.headTeacher.userId}`} className="department-head-link">
                                            {department.headTeacher.firstName} {department.headTeacher.lastName}
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                            <DepartmentCourses
                                departmentId={departmentId}
                                departmentHeadId={department.head ? department.head.id : null}
                                teachers={teachers} />
                        </div>
                    </div>
                    <DepartmentSideMenu
                        openEdit={openEditMenu}
                        openDelete={openDeleteMenu}
                        openManageTeachers={openManageTeacherMenu}
                        userRole={user.role}
                        teachers={teachers}
                        departmentId={departmentId}
                    />
                    <ToastContainer containerId={"departmentToast"} />
                    <ManageDepartmentTeachers
                        showModal={openManageTeachers}
                        onClose={closeManageTeacherMenu}
                        departmentTeachers={teachers}
                        teachersWithoutDepartment={teachersWithoutDepartment}
                        fetchDepartment={loadDepartment}
                        departmentId={departmentId} />
                    <EditDepartment showModal={openEdit} onClose={closeEditMenu} teachers={teachers} initialDepartment={department} fetchDepartment={fetchDepartmentDetails} />
                    <DeleteModal showModal={openDelete} onClose={closeDeleteMenu} deleteEntity={deleteDepartment} deleteText={deleteMessage} />
                </div>
            )}
        </div>
    );
};

export default Department;
