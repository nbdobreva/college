import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './component/Layout'
import Login from './component/Login';
import ProtectedRoute from './common/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>}>
          </Route>
        </Routes>
        <Layout />
      </Router>
    </AuthProvider >
  );
};

export default App;