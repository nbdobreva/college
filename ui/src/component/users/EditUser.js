import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../../styles/user/EditUser.css';

const EditUser = ({ showModal, initialUser, onClose, fetchUser }) => {
    const { user } = useAuth();
    const [body, setBody] = useState(null);
    const [firstName, setFirstName] = useState(initialUser.firstName);
    const [lastName, setLastName] = useState(initialUser.lastName);


    const changeUserAttribute = (attribute, value) => {
        setBody(prevBody => ({
            ...prevBody,
            [attribute]: value,
        }));
    };


    const updateUser = async () => {
        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Users/${initialUser.id}`, {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify(body)
                });

                if (response.status === 200) {
                    onClose();
                    fetchUser();
                    toast('User updated!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Update userEntity failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during userEntity update:', error);
            }
        };
    }



    return (
        showModal && initialUser && (
            <div className="edit-modal-overlay">
                <div className="edit-modal">
                    <div className="close-button" onClick={onClose}>
                        <i className="bi bi-x" />
                    </div>
                    <div className="edit-userEntity-details">
                        <h1 className="edit-userEntity-name">{firstName} {lastName}</h1>
                        <form className="edit-userEntity-form"
                            onSubmit={(e) => { e.preventDefault(); updateUser(); }}>
                            <div>
                                <input
                                    className="edit-userEntity-input"
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Last Name*"
                                    value={firstName}
                                    onChange={(e) => { changeUserAttribute("firstName", e.target.value); setFirstName(e.target.value) }}
                                />
                                <input
                                    className="edit-userEntity-input"
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Last Name*"
                                    value={lastName}
                                    onChange={(e) => { changeUserAttribute("lastName", e.target.value); setLastName(e.target.value) }}
                                />
                                <div className="edit-userEntity-buttons">
                                    <button className="edit-userEntity-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                                    <button
                                        className="edit-userEntity-button edit-button"
                                        type="submit">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    )
};

export default EditUser;
