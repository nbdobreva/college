import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { prepareBody } from '../helpers/utils';

import '../../styles/faculty/EditFaculty.css';

const EditFaculty = ({ showModal, initialFaculty, onClose, fetchFaculty }) => {
    const { user } = useAuth();
    const [faculty, setFaculty] = useState(initialFaculty);
    const [isNameEmpty, setIsNameEmpty] = useState(false);

    const changeFacultyAttribute = (attribute, value) => {
        setFaculty(prevFaculty => ({
            ...prevFaculty,
            [attribute]: value,
        }));
    };

    const updateFaculty = async () => {
        const body = JSON.stringify(prepareBody(faculty));

        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Faculties/${faculty.id}`, {
                    method: 'PUT',
                    headers: headers,
                    body: body
                });

                if (response.status === 200) {
                    onClose();
                    fetchFaculty();
                    toast('Faculty updated!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Update faculty failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during faculty update:', error);
            }
        };
    }


    return (
        showModal && faculty && (
            <div className="edit-modal-overlay">
                <div className="edit-modal">
                    <div className="close-button" onClick={onClose}>
                        <i className="bi bi-x" />
                    </div>
                    <div className="edit-faculty-details">
                        <h1 className="edit-faculty-name">{faculty.name}</h1>
                        <form className="edit-faculty-form" onSubmit={(e) => { e.preventDefault(); updateFaculty(); onClose(); }}>
                            <div>
                                <input
                                    className="edit-faculty-input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name*"
                                    value={faculty.name}
                                    onChange={(e) => { changeFacultyAttribute("name", e.target.value); setIsNameEmpty(false) }}
                                />
                                <textarea
                                    className="description-input new-faculty-input"
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder="Description"
                                    maxLength={700}
                                    value={faculty.description}
                                    onChange={(e) => { changeFacultyAttribute("description", e.target.value) }}

                                />
                            </div>
                            <div className="edit-faculty-buttons">
                                <button className="edit-faculty-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                                <button
                                    className="edit-faculty-button edit-button"
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

export default EditFaculty;
