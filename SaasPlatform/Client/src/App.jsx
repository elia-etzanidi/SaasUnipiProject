import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import SearchPage from './components/Search/SearchPage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfile from './components/CompleteProfile/CompleteProfile.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// If the user is not logged in, redirect to login page
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// If the user is logged in, redirect to dashboard
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          {/* Protected Routes - Token required */}
          <Route element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="search" element={<SearchPage />} />
          </Route>

          {/* Default Redirect Logic */}
          <Route path="/" element={
            localStorage.getItem('token') ? 
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>  
  );
}

export default App;
