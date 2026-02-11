import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import SearchPage from './components/Search/SearchPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - With MainLayout */}
        <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="search" element={<SearchPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
