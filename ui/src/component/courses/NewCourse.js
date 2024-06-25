import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/course/NewCourse.css';


const NewCourse = ({ showModal, onClose, fetchCourses, departmentId, teachers }) => {
    const { user } = useAuth();
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [teacherId, setTeacherId] = useState(null);

    const createCourse = async () => {
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

                const response = await fetch(`http://localhost:8000/api/Courses`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        teacherId: teacherId,
                        departmentId: departmentId
                    }),
                });

                if (response.status === 201) {
                    onClose();
                    fetchCourses();
                    toast('Course is successfully created', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Create course failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during course creation:', error);
            }
        };
    }

    return (
        showModal && (
            <div className="new-course-modal-overlay">
                <div className="new-course-modal">
                    <div className="new-course-close-button" onClick={() => onClose()}>
                        <i className="bi bi-x" />
                    </div>
                    <h2>{name ? name : "New Course"}</h2>
                    <form className="new-course-form" onSubmit={(e) => { e.preventDefault(); createCourse(); setName(''); setDescription(''); onClose(); }}>
                        <div>
                            <input
                                className="new-course-input"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name*"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                            <textarea
                                className="description-input new-course-input"
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                maxLength={700}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}

                            />
                            <div className="new-course-select">
                                <i className="bi bi-mortarboard-fill new-course-select-icon"></i>
                                <select
                                    id="headTeacher"
                                    className="new-course-select-options"
                                    value={teacherId}
                                    onChange={(e) => setTeacherId(e.target.value)}
                                >
                                    <option value="">None</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacherId}>
                                            {teacher.firstName} {teacher.lastName}
                                        </option>
                                    )
                                    )}
                                </select>
                            </div>                        </div>
                        <div className="new-course-buttons">
                            <button className="new-course-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                            <button
                                className="new-course-button create-button"
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

export default NewCourse;
