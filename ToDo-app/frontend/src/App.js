import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BoardPage from './workspace/BoardPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import WorkspacesPage from './pages/workspace/WorkspacesPage';
import WorkspacePage from './pages/workspace/WorkspacePage';
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
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        
        {/* Routes protégées */}
        <Route element={<ProtectedRoute withMenu />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Routes pour les espaces de travail */}
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/workspaces/:workspaceId" element={<WorkspacePage />} />
          
          {/* Routes pour les tableaux */}
          <Route path="/boards" element={<BoardPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
          
          {/* Route admin */}
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppWrapper;