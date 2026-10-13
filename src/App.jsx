import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HotelProvider } from './context/HotelContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Book from './pages/Book';
import AdminBookings from './pages/AdminBookings';
import MyBookings from './pages/MyBookings';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <HotelProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} /> {/* Shortcuts to Login for demo */}
              
              <Route path="/book" element={
                <ProtectedRoute>
                  <Book />
                </ProtectedRoute>
              } />

              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } />

              <Route path="/admin/bookings" element={
                <ProtectedRoute role="admin">
                  <AdminBookings />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </HotelProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
