import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/faculty/NewFaculty.css';


const NewFaculty = ({ showModal, onClose, fetchFaculties }) => {
    const { user } = useAuth();
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);

    const [isNameEmpty, setIsNameEmpty] = useState(false);

    const createFaculty = async () => {
        if (!name) {
            setIsNameEmpty(true);
            return;
        }

        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Faculties`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        name: name,
                        description: description
                    }),
                });

                if (response.status === 201) {
                    onClose();
                    fetchFaculties();
                    toast('Faculty is successfully created', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Create faculty failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during faculty creation:', error);
            }
        };
    }

    return (
        showModal && (
            <div className="new-faculty-modal-overlay">
                <div className="new-faculty-modal">
                    <div className="new-faculty-close-button" onClick={() => onClose()}>
                        <i className="bi bi-x" />
                    </div>
                    <h2>{name ? name : "New Faculty"}</h2>
                    <form className="new-faculty-form" onSubmit={(e) => { e.preventDefault(); createFaculty(); setName(''); setDescription(''); onClose(); }}>
                        <div>
                            <input
                                className="new-faculty-input"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name*"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setIsNameEmpty(false) }}
                            />
                            <textarea
                                className="description-input new-faculty-input"
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                maxLength={65535}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}

                            />
                        </div>
                        <div className="new-faculty-buttons">
                            <button className="new-faculty-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                            <button
                                className="new-faculty-button create-button"
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

export default NewFaculty;
