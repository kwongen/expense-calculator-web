import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({
    isAuthenticated,
    redirectPath = '/login',
    children,
  }) => {
    if (!isAuthenticated) {
        return (
            <>
            <Navigate to={redirectPath} replace={true} />;
            </>
        )
    }
  
    return children ? children : <Outlet />;
  };

export default ProtectedRoute;