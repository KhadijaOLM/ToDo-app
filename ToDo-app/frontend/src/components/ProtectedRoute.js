import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import Menu from './Menu';

const ProtectedRoute = ({ withMenu = false, children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {withMenu && <Menu />}
      {children || <Outlet />}
    </>
  );
};

export default ProtectedRoute;