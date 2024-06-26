import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/department/ManageDepartmentTeachers.css';

const ManageDepartmentTeachers = ({ showModal, departmentTeachers, teachersWithoutDepartment, onClose, fetchDepartment, departmentId }) => {
    const { user } = useAuth();
    const [searchQuery, setSearchDept] = useState('');
    const [filteredDeptTeachers, setFilteredDeptTeachers] = useState([]);
    const [teachersForRemoval, setTeachersForRemoval] = useState(new Set());
    const [teachersToAdd, setTeachersToAdd] = useState(new Set());
    const [addSearchQuery, setAddSearchQuery] = useState('');
    const [filteredAddTeachers, setFilteredAddTeachers] = useState([]);

    console.log(departmentTeachers);
    useEffect(() => {
        if (departmentTeachers) {
            const filtered = departmentTeachers.filter((teacher) =>
                teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
            setFilteredDeptTeachers(filtered);
        }

        if (teachersWithoutDepartment) {
            const filtered = teachersWithoutDepartment.filter((teacher) =>
                teacher.firstName.toLowerCase().includes(addSearchQuery.toLowerCase()) ||
                teacher.lastName.toLowerCase().includes(addSearchQuery.toLowerCase()))
            setFilteredAddTeachers(filtered);
        }
    }, [user, searchQuery, departmentTeachers, teachersWithoutDepartment, addSearchQuery]);

    const handleToggleDepartmentTeacher = (teacherId) => {
        setTeachersForRemoval((prevTeachersForRemoval) => {
            const updatedTeachersForRemoval = new Set(prevTeachersForRemoval);
            if (updatedTeachersForRemoval.has(teacherId)) {
                updatedTeachersForRemoval.delete(teacherId);
            } else {
                updatedTeachersForRemoval.add(teacherId);
            }
            return updatedTeachersForRemoval;
        });
    };

    const handleToggleAddTeacher = (teacherId) => {
        setTeachersToAdd((prevTeachersToAdd) => {
            const updatedTeachersToAdd = new Set(prevTeachersToAdd);
            if (prevTeachersToAdd.has(teacherId)) {
                prevTeachersToAdd.delete(teacherId);
            } else {
                prevTeachersToAdd.add(teacherId);
            }
            return updatedTeachersToAdd;
        });
    };

    const handleSaveChanges = async () => {
        for (const teacherId of teachersForRemoval) {
            await removeTeacherFromDepartment(teacherId);
        }

        for (const teacherId of teachersToAdd) {
            await addTeacherToDepartment(teacherId);
        }

        fetchDepartment();
        onClose();
    };

    const removeTeacherFromDepartment = async (teacherId) => {
        try {
            const token = localStorage.getItem('Authentication');
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            });

            const response = await fetch(`http://localhost:8000/api/Teachers/${teacherId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    departmentId: ""
                })
            });

            if (response.status !== 204) {
                console.error('Update department failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during department update:', error);
        }
    };

    const addTeacherToDepartment = async (teacherId) => {
        try {
            const token = localStorage.getItem('Authentication');
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            });

            const response = await fetch(`http://localhost:8000/api/Teachers/${teacherId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    departmentId: `${departmentId}`
                })
            });

            if (response.status !== 204) {
                console.error('Update department failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during department update:', error);
        }
    };


    return (
        showModal && departmentTeachers && (
            <div className="teachers-modal-overlay">
                <div className="teachers-modal">
                    <div className="close-button" onClick={onClose}>
                        <i className="bi bi-x" />
                    </div>
                    <div className="teachers-department-details">
                        <input
                            className="department-teachers-search-menu"
                            type="text"
                            placeholder="Search teachers in department"
                            value={searchQuery}
                            onChange={(e) => setSearchDept(e.target.value)}
                        />
                        <div className="teachers-department-list">
                            {filteredDeptTeachers.filter((teacher) => !teacher.headOfDepartment)
                                .map((teacher) => (
                                    <div key={teacher.id} className="teachers-department-name">
                                        {teacher.firstName} {teacher.lastName}
                                        <button
                                            type="button"
                                            className="add-remove-button"
                                            onClick={() => handleToggleDepartmentTeacher(teacher.id)}
                                        >
                                            {teachersForRemoval.has(teacher.id) ? 'Add to department' : 'Remove from department'}
                                        </button>
                                    </div>
                                ))}
                        </div>
                        <div className="teachers-department-menu-divider">
                            <div className="divider-line" />
                        </div>

                        <input
                            className="department-teachers-search-menu"
                            type="text"
                            placeholder="Search all teachers"
                            value={addSearchQuery}
                            onChange={(e) => setAddSearchQuery(e.target.value)}
                        />
                        {addSearchQuery ?
                            <div className="teachers-department-list">
                                {filteredAddTeachers.map((teacher) => (
                                    <div key={teacher.id} className="teachers-department-name">
                                        {teacher.firstName} {teacher.lastName}
                                        <button
                                            type="button"
                                            className="add-remove-button"
                                            onClick={() => handleToggleAddTeacher(teacher.id)}
                                        >
                                            {teachersToAdd.has(teacher.id) ? 'Remove from department' : 'Add to department'}
                                        </button>
                                    </div>
                                ))}
                            </div> : null
                        }

                    </div>
                    <div className="teachers-department-buttons">
                        <button className="teachers-department-button cancel-button" type="button" onClick={onClose}>Cancel</button>
                        <button className="teachers-department-button teachers-button" type="button" onClick={handleSaveChanges}>Save Changes</button>
                    </div>
                </div>
            </div>
        )
    )
};

export default ManageDepartmentTeachers;
