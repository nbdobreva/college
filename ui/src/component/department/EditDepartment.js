import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../../styles/department/EditDepartment.css';

const EditDepartment = ({ showModal, initialDepartment, teachers, onClose, fetchDepartment }) => {
    const { user } = useAuth();
    const [body, setBody] = useState(null);
    const [selectedHeadTeacher, setSelectedHeadTeacher] = useState(initialDepartment.headTeacher);
    const [name, setName] = useState(initialDepartment.name);
    const [description, setDescription] = useState(initialDepartment.description);

    const changeDepartmentAttribute = (attribute, value) => {
        setBody(prevBody => ({
            ...prevBody,
            [attribute]: value,
        }));
    };


    const updateDepartment = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Departments/${initialDepartment.id}`, {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify(body)
                });

                if (response.status === 200) {
                    onClose();
                    fetchDepartment();
                    toast('Department updated!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Update department failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during department update:', error);
            }
        };
    }



    return (
        showModal && initialDepartment && (
            <div className="edit-modal-overlay">
                <div className="edit-modal">
                    <div className="close-button" onClick={onClose}>
                        <i className="bi bi-x" />
                    </div>
                    <div className="edit-department-details">
                        <h1 className="edit-department-name">{name}</h1>
                        <form className="edit-department-form"
                            onSubmit={(e) => { e.preventDefault(); updateDepartment(); }}>
                            <div>
                                <input
                                    className="edit-department-input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name*"
                                    value={name}
                                    onChange={(e) => { changeDepartmentAttribute("name", e.target.value); setName(e.target.value) }}
                                />
                                <textarea
                                    className="description-input new-department-input"
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder="Description"
                                    maxLength={700}
                                    value={description}
                                    onChange={(e) => { changeDepartmentAttribute("description", e.target.value); setDescription(e.target.value) }}

                                />

                                <div className="edit-department-select">
                                    <i className="bi bi-mortarboard-fill edit-department-select-icon"></i>
                                    <select
                                        id="headTeacher"
                                        className="edit-department-select-options"
                                        value={selectedHeadTeacher}
                                        onChange={(e) => changeDepartmentAttribute("headId", e.target.value)}
                                    >
                                        {selectedHeadTeacher && teachers.filter(teacher => teacher.id === selectedHeadTeacher.id).map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.firstName} {teacher.lastName}
                                            </option>
                                        ))}
                                        <option value="">None</option>
                                        {teachers.map((teacher) => (
                                            teacher.id !== selectedHeadTeacher && (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.firstName} {teacher.lastName}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="edit-department-buttons">
                                <button className="edit-department-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                                <button
                                    className="edit-department-button edit-button"
                                    type="submit">
                                    Edit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    )
};

export default EditDepartment;
