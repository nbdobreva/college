import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';
import Dashboard from './Dashboard';
import Header from './Header';
import Sidebar from './Sidebar';

import '../styles/Layout.css'
import Faculties from './faculty/Faculties';
import Faculty from './faculty/Faculty';
import Department from './department/Department';
import Course from './courses/Course';
import MyCourses from './courses/MyCourses';
import Departments from './department/AllDepartments';
import Users from './users/Users';
import User from './users/User';

const Layout = () => {
    return (
        <div>
            <Header />
            <div className="sidebar-layout">
                <Sidebar />
                <div className="page-layout">
                    <Routes>
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" />
                            </ProtectedRoute>} />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculties/:facultyId"
                            element={
                                <ProtectedRoute>
                                    <Faculty />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculties/*"
                            element={
                                <ProtectedRoute>
                                    <Faculties />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/departments/:departmentId"
                            element={
                                <ProtectedRoute>
                                    <Department />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/departments/*"
                            element={
                                <ProtectedRoute>
                                    <Departments />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/courses/:courseId"
                            element={
                                <ProtectedRoute>
                                    <Course />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-courses"
                            element={
                                <ProtectedRoute>
                                    <MyCourses />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/users/:userId"
                            element={
                                <ProtectedRoute>
                                    <User />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users/*"
                            element={
                                <ProtectedRoute>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>
                </div>
            </div>
        </div >
    );
};

export default Layout;
