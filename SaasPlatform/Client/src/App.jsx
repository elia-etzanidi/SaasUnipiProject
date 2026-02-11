import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import SearchPage from './components/Search/SearchPage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfile from './components/CompleteProfile/CompleteProfile.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          {/* Protected Routes - With MainLayout */}
          <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="search" element={<SearchPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>  
  );
}

export default App;
