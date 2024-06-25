import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../../styles/course/EditCourse.css';

const EditCourse = ({ showModal, initialCourse, onClose, fetchCourse, teachers }) => {
    const { user } = useAuth();
    const [body, setBody] = useState(null);
    const [courseTeacherId, setCourseTeacherId] = useState(initialCourse.teacherId);
    const [name, setName] = useState(initialCourse.name);
    const [description, setDescription] = useState(initialCourse.description);

    const changeCourseAttribute = (attribute, value) => {
        setBody(prevBody => ({
            ...prevBody,
            [attribute]: value,
        }));
    };

    const updateCourse = async () => {
        if (!body) {
            onClose();
            return;
        }
        if (user && user.id) {

            try {
                const token = localStorage.getItem('Authentication');
                const headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                });

                const response = await fetch(`http://localhost:8000/api/Courses/${initialCourse.id}`, {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify(body)
                });

                if (response.status === 200) {
                    onClose();
                    fetchCourse();
                    toast('Course updated!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        theme: "light",
                        bodyClassName: "toast-class"
                    });
                } else {
                    console.error('Update course failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during course update:', error);
            }
        };
    }



    return (
        showModal && initialCourse && (
            <div className="edit-modal-overlay">
                <div className="edit-modal">
                    <div className="close-button" onClick={onClose}>
                        <i className="bi bi-x" />
                    </div>
                    <div className="edit-course-details">
                        <h1 className="edit-course-name">{name}</h1>
                        <form className="edit-course-form"
                            onSubmit={(e) => { e.preventDefault(); updateCourse(); }}>
                            <div>
                                <input
                                    className="edit-course-input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name*"
                                    value={name}
                                    onChange={(e) => { changeCourseAttribute("name", e.target.value); setName(e.target.value) }}
                                />
                                <textarea
                                    className="description-input new-course-input"
                                    type="text"
                                    id="description"
                                    name="description"
                                    placeholder="Description"
                                    maxLength={700}
                                    value={description}
                                    onChange={(e) => { changeCourseAttribute("description", e.target.value); setDescription(e.target.value) }}

                                />

                                <div className="edit-course-select">
                                    <i className="bi bi-mortarboard-fill edit-course-select-icon"></i>
                                    <select
                                        id="headTeacher"
                                        className="edit-course-select-options"
                                        value={courseTeacherId || null}
                                        onChange={(e) => { changeCourseAttribute("teacherId", e.target.value); setCourseTeacherId(e.target.value) }}
                                    >
                                        {courseTeacherId && teachers.filter(teacher => teacher.id === courseTeacherId).map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.firstName} {teacher.lastName}
                                            </option>
                                        ))}
                                        <option value="">None</option>
                                        {teachers.map((teacher) => (
                                            teacher.id !== courseTeacherId && (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.firstName} {teacher.lastName}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="edit-course-buttons">
                                <button className="edit-course-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                                <button
                                    className="edit-course-button edit-button"
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

export default EditCourse;
