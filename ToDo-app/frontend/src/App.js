
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BoardPage from './workspace/BoardPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute withMenu />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/boards" element={<BoardPage />} />
            <Route path="/boards/:id" element={<BoardPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default AppWrapper;