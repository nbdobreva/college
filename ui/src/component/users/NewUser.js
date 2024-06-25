import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/user/NewUser.css';


const NewUser = ({ showModal, onClose, fetchUsers }) => {
    const { user } = useAuth();
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [role, setRole] = useState(null);


    const createUser = async () => {
        if (!firstName || !lastName) {
            return;
        }

        if (user && user.id) {
            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/auth/register`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        role: role
                    }),
                });

                if (response.status === 201) {
                    onClose();
                    fetchUsers();
                    toast('User is successfully created', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Create user failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during user creation:', error);
            }
        };
    }

    return (
        showModal && (
            <div className="new-user-modal-overlay">
                <div className="new-user-modal">
                    <div className="new-user-close-button" onClick={() => onClose()}>
                        <i className="bi bi-x" />
                    </div>
                    <h2>{firstName || lastName ? (firstName + "" + lastName) : "New User"}</h2>
                    <form className="new-user-form" onSubmit={(e) => { e.preventDefault(); createUser(); setFirstName(''); setLastName(''); setRole(''); onClose(); }}>
                        <div>
                            <input
                                className="new-user-input"
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First Name*"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value) }}
                            />
                            <input
                                className="new-user-input"
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name*"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value) }}
                            />
                            <div className="new-user-role-select">
                                <span style={{ "width": "50px" }}> <i className="bi bi-mortarboard-fill user-role-select-icon"></i></span>
                                <select
                                    id="role"
                                    className="new-user-select-options"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="">None</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </div>
                        <div className="new-user-buttons">
                            <button className="new-user-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                            <button
                                className="new-user-button create-button"
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

export default NewUser;
