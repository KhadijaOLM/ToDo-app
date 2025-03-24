import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BoardPage from './pages/BoardPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app">
      <Menu />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/boards" element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;