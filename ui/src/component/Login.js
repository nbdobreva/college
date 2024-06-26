import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css';


const Login = () => {
    const navigate = useNavigate();
    const { setAuthData } = useAuth();
    const [showLogin, setShowLogin] = useState(true);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('Authentication', basicAuth);
                localStorage.setItem('User', JSON.stringify(data));
                setAuthData({ isAuthenticated: true, data });

                if (data.role === "STUDENT") {
                    await fetchStudent(data.id);
                }
                if (data.role === "TEACHER") {
                    await fetchTeacher(data.id);
                }
                navigate('/dashboard');
            } else {
                console.error('Authentication failed with status', response.status);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const fetchStudent = async (userId) => {
        try {
            const token = localStorage.getItem('Authentication');
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            });

            const response = await fetch(`http://localhost:8000/api/Students?userId=${userId}`, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const studentData = await response.json();
                localStorage.setItem('Entity', JSON.stringify(studentData));
            } else {
                console.error('Failed to fetch student:', response.status);
            }
        } catch (error) {
            console.error('Error during student fetch:', error);
        }

    }

    const fetchTeacher = async (userId) => {
        try {
            const token = localStorage.getItem('Authentication');
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            });

            const response = await fetch(`http://localhost:8000/api/Teachers?userId=${userId}&expand=courses`, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const teacherData = await response.json();
                localStorage.setItem('Entity', JSON.stringify(teacherData));
            } else {
                console.error('Failed to fetch student:', response.status);
            }
        } catch (error) {
            console.error('Error during student fetch:', error);
        }

    }

    return (
        <div className="landing-page">
            <div className="overlay">
                <div className="login-container">
                    <h1 className="login-h1">Welcome to College!</h1>
                    <p className="login-prompt">
                        Please log in to continue
                    </p>
                    <form className="login-form">

                        <input
                            className="login-input"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            className="login-input"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
