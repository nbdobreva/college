import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/department/NewDepartment.css';


const NewDepartment = ({ showModal, onClose, fetchDepartments, facultyId }) => {
    const { user } = useAuth();
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [headTeacher, setHeadTeacher] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [faculty, setFaculty] = useState(facultyId);

    const isFacultyPresent = facultyId;

    useEffect(() => {
        fetchTeachers();
        fetchFaculties();
    }, [user]);

    const fetchTeachers = async () => {
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
                    const filteredTeachers = data.filter(teacher => teacher.department === null);
                    setTeachers(filteredTeachers);
                } else {
                    console.error('Failed to fetch faculty departments:', response.status);
                }
            } catch (error) {
                console.error('Error during departments fetch:', error);
            }
        }
    };

    const fetchFaculties = async () => {
        if (user && !facultyId) {
            try {
                const token = localStorage.getItem('Authentication');
                const response = await fetch(`http://localhost:8000/api/Faculties`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFaculties(data);
                } else {
                    console.error('Failed to fetch faculty departments:', response.status);
                }
            } catch (error) {
                console.error('Error during departments fetch:', error);
            }
        }
    };

    const createDepartment = async () => {
        if (!name) {
            return;
        }

        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Departments`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        headId: headTeacher.id || null,
                        facultyId: facultyId
                    }),
                });

                if (response.status === 201) {
                    onClose();
                    fetchDepartments();
                    toast('Department is successfully created', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Create department failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during department creation:', error);
            }
        };
    }


    return (
        showModal && (
            <div className="new-department-modal-overlay">
                <div className="new-department-modal">
                    <div className="new-department-close-button" onClick={() => onClose()}>
                        <i className="bi bi-x" />
                    </div>
                    <h2>{name ? name : "New Department"}</h2>
                    <form className="new-department-form" onSubmit={(e) => { e.preventDefault(); createDepartment(); setName(''); setDescription(''); onClose(); }}>
                        <div>
                            <input
                                className="new-department-input"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name*"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                            <textarea
                                className="description-input new-department-input"
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                maxLength={700}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}

                            />
                            <div className="new-department-select">
                                <span style={{ "width": "50px" }}> <i className="bi bi-mortarboard-fill edit-department-select-icon"></i></span>
                                <select
                                    id="headTeacher"
                                    className="new-department-select-options"
                                    value={headTeacher}
                                    onChange={(e) => setHeadTeacher(e.target.value)}
                                >
                                    <option value="">None</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.firstName} {teacher.lastName}
                                        </option>
                                    )
                                    )}
                                </select>
                            </div>
                            {!isFacultyPresent ?
                                <div className="new-department-select">
                                    <span style={{ "width": "50px" }}><i className="bi bi-bank edit-department-select-icon"></i></span>
                                    <select
                                        id="faculty"
                                        className="new-department-select-options"
                                        value={faculty}
                                        onChange={(e) => setFaculty(e.target.value)}
                                    >
                                        <option value="">None</option>
                                        {faculties.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name}
                                            </option>
                                        )
                                        )}
                                    </select>
                                </div> : null}
                        </div>
                        <div className="new-department-buttons">
                            <button className="new-department-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                            <button
                                className="new-department-button create-button"
                                type="submit">
                                Create
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        )
    );
};

export default NewDepartment;
